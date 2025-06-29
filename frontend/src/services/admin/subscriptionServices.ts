import BaseApi from "../BaseApi";


export const getActiveSubscription = async (schoolId: string) => {
    try {
        const response = await BaseApi.getRequest(`/school/${schoolId}/active`);
        return response;
    } catch (error) {
        throw error;
    }
};

export interface IActiveSubscription {
    id: string;
    planId: string;
    schoolId: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'cancelled';
    planDetails: {
        name: string;
        price: number;
        durationDays: number;
        type: string;
        features: {
            students: string | number;
            classes: string | number;
            subjects: string | number;
            departments: string | number;
            library: boolean;
            transport: boolean;
        };
    };
} 