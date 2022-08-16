/*
 * @created 13/06/2021 - 09:10
 * @project phoenixparticipate-v1
 * @author andreasjj
 */

import { PaymentMethodType } from './types';

export const getPaymentMethodName: (paymentOption: PaymentMethodType) => string | undefined = (
    paymentOption: PaymentMethodType,
) => {
    switch (paymentOption) {
        case PaymentMethodType.vipps:
            return 'Vipps';
        case PaymentMethodType.card:
            return 'Kort';
    }
};
