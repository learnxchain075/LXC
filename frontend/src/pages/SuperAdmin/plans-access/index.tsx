import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import PlanCard from "./PlanCard";
import SchoolSelector from "./SchoolSelector";

import BaseApi from "../../../services/BaseApi";
import RazorpayService from "../../../services/paymentHandler/razorpayPlanAPI";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PlansAccessPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await BaseApi.getRequest("/super/plans");
        setPlans(res.data);
      } catch (err) {
        setError("❌ Unable to fetch plans. Please try again later.");
      }
    };

    fetchPlans();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!selectedSchool || !selectedPlan) {
      return alert("Please select both a school and a plan.");
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const orderRes = await RazorpayService.createOrder({
        planId: selectedPlan.id,
        schoolId: selectedSchool.id,
      });

      const {
        orderId,
        amount,
        currency,
        keyId: razorpayKey,
      } = orderRes.data;

      if (!orderId || !amount || !currency || !razorpayKey) {
        throw new Error("Invalid Razorpay order response from backend");
      }

      const options: any = {
        key: razorpayKey,
        amount,
        currency,
        name: "LearnXChain",
        description: selectedPlan.name,
        order_id: orderId,
        handler: async (response: any) => {
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            setError("❌ Razorpay did not return required fields. Payment failed.");
            return;
          }

          try {
            const verifyPayload = {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              planId: selectedPlan.id,
              schoolId: selectedSchool.id,
            };

            const verificationRes = await RazorpayService.verifyPayment(verifyPayload);

            const verifiedStatus =
              verificationRes?.data?.subscription?.status === "SUCCESS";

            if (verifiedStatus) {
              setSuccess("✅ Payment verified and plan activated!");
            } else {
              // Unexpected verification result
              setError("❌ Verification failed. Please contact support.");
            }
          } catch (verifyErr: any) {
            // Verification error
            setError("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: selectedSchool.name || "School Admin",
          email: selectedSchool.email || "school@example.com",
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("❌ Payment initiation failed:", err.response?.data || err.message);
      setError("❌ Failed to initiate Razorpay checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container mt-5">
        <h2 className="mb-4">Grant Plan Access to Schools</h2>

        <div className="mb-4">
          <SchoolSelector onSelect={setSelectedSchool} />
          {selectedSchool && (
            <div className="mt-2">
              Selected School: <strong>{selectedSchool.name}</strong>
            </div>
          )}
        </div>

        <div className="row">
          {plans.map((plan: any) => (
            <div key={plan.id} className="col-md-4 mb-3">
              <PlanCard
                plan={plan}
                selected={selectedPlan?.id === plan.id}
                onSelect={() => setSelectedPlan(plan)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 d-flex gap-3">
          <Button
            variant="success"
            onClick={handleRazorpayPayment}
            disabled={submitting || !selectedSchool || !selectedPlan}
          >
            {submitting ? <Spinner size="sm" animation="border" /> : "Buy Plan with Razorpay"}
          </Button>
        </div>

        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default PlansAccessPage;
