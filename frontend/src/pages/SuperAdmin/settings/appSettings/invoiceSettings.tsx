import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";

import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import CommonSelect from "../../../../core/common/commonSelect";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const routes = all_routes;
const InvoiceSettings = () => {
  const options1 = [
    { value: "5", label: "5" },
    { value: "4", label: "4" },
    { value: "3", label: "3" },
  ];

  const options2 = [
    { value: "roundoff-up", label: "Roundoff Up" },
    { value: "roundoff-down", label: "Roundoff Down" },
  ];
  return (
    <div>
      <div className="page-wrapper">
        <div className="content bg-white">
          <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">App Settings</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="index">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Settings</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    App Settings
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
                >
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                  >
                    <i className="ti ti-refresh" />
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-2 col-xl-3">
              <div className="pt-3 d-flex flex-column list-group mb-4">
                <Link
                  to={routes.invoiceSettings}
                  className="d-block rounded p-2 active"
                >
                  Invoice Settings
                </Link>
                <Link to={routes.customFields} className="d-block rounded p-2">
                  Custom Fields
                </Link>
              </div>
            </div>
            <div className="col-xxl-10 col-xl-9">
              <div className="flex-fill border-start ps-3">
                <form>
                  <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                    <div className="mb-3">
                      <h5 className="mb-1">Invoice Settings</h5>
                      <p>Collection of settings for Invoice</p>
                    </div>
                    <div className="mb-3">
                      <button className="btn btn-light me-2" type="button">
                        Cancel
                      </button>
                      <button className="btn btn-primary" type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="d-md-flex d-block">
                    <div className="row flex-fill">
                      <div className="col-xl-10">
                        <div className="settings-middle-info invoice-setting-wrap">
                          <div className="row align-items-center mb-2">
                            <div className="col-xxl-7 col-lg-6">
                              <div className="invoice-info-title">
                                <h6>Invoice Logo</h6>
                                <p>
                                  Upload logo of you company to display in Invoice
                                </p>
                              </div>
                            </div>
                            <div className="col-xxl-5 col-lg-6">
                              <div className="card">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                      <span className="avatar avatar-xl border rounded d-flex align-items-center justify-content-center p-2 me-2">
                                        <ImageWithBasePath
                                          src="assets/img/logo-small.svg"
                                          alt="Img"
                                        />
                                      </span>
                                      <h5>Logo</h5>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Link
                                        to="#"
                                        className="text-primary border rounded fs-16 p-1 badge badge-primary-hover me-2"
                                      >
                                        <i className="ti ti-edit-circle" />
                                      </Link>
                                      <Link
                                        to="#"
                                        className="text-danger border rounded fs-16 p-1 badge badge-danger-hover"
                                      >
                                        <i className="ti ti-trash-x" />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="profile-uploader profile-uploader-two mb-0">
                                    <span className="d-block text-center lh-1 fs-24 mb-1">
                                      <i className="ti ti-upload" />
                                    </span>
                                    <div className="drag-upload-btn bg-transparent me-0 border-0">
                                      <p className="fs-12 mb-2">
                                        <span className="text-primary">
                                          Click to Upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <h6>JPG or PNG</h6>
                                      <h6>(Max 450 x 450 px)</h6>
                                    </div>
                                    <input
                                      type="file"
                                      className="form-control"
                                      multiple
                                      id="image_sign"
                                    />
                                    <div id="frames" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                            <div className="row align-items-center flex-fill">
                              <div className="col-xxl-7 col-lg-6">
                                <div className="mb-3">
                                  <h6>Invoice Prefix</h6>
                                  <p>Add prefix to your Invoice</p>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-lg-6">
                                <div className="mb-3">
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                            <div className="row align-items-center flex-fill">
                              <div className="col-xxl-7 col-lg-6">
                                <div className="mb-3">
                                  <h6>Invoice Due</h6>
                                  <p>Select due date to display in Invoice </p>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-lg-6">
                                <div className="mb-3 d-flex align-items-center">
                                  <div className="w-100">
                                    <CommonSelect
                                      className="select"
                                      options={options1}
                                      defaultValue={options1[0]}
                                    />
                                  </div>
                                  <span className="ms-3 d-block">Days</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                            <div className="row align-items-center flex-fill">
                              <div className="col-xxl-7 col-lg-6">
                                <div className="mb-3">
                                  <h6>Invoice Round Off</h6>
                                  <p>Value round off in invoice</p>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-lg-6">
                                <div className="mb-3 d-flex align-items-center">
                                  <div className="w-100">
                                    <CommonSelect
                                      className="select"
                                      options={options2}
                                      defaultValue={options2[0]}
                                    />
                                  </div>
                                  <div className="status-toggle modal-status ms-3">
                                    <input
                                      type="checkbox"
                                      id="user1"
                                      className="check"
                                    />
                                    <label htmlFor="user1" className="checktoggle">
                                      {" "}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                            <div className="row align-items-center flex-fill">
                              <div className="col-xxl-7 col-lg-6">
                                <div className="mb-3">
                                  <h6>Show Company Details</h6>
                                  <p>Show/hide company details in invoice</p>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-lg-6">
                                <div className="mb-3">
                                  <div className="status-toggle modal-status">
                                    <input
                                      type="checkbox"
                                      id="user2"
                                      className="check"
                                    />
                                    <label htmlFor="user2" className="checktoggle">
                                      {" "}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                            <div className="row align-items-center flex-fill">
                              <div className="col-xxl-7 col-lg-6">
                                <div className="mb-3">
                                  <h6>Invoice Header Terms</h6>
                                  <p>Header Terms</p>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-lg-6">
                                <div className="mb-3">
                                  <textarea
                                    rows={4}
                                    className="form-control"
                                    placeholder="Add Comment"
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                            <div className="row align-items-center flex-fill">
                              <div className="col-xxl-7 col-lg-6">
                                <div className="mb-3">
                                  <h6>Invoice Footer Terms</h6>
                                  <p>Footer Terms</p>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-lg-6">
                                <div className="mb-3">
                                  <textarea
                                    rows={4}
                                    className="form-control"
                                    placeholder="Add Comment"
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InvoiceSettings;
