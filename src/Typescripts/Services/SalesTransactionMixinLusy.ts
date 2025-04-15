import { SalesTransaction } from '../Entities/SalesTransaction';

export const SalesTransactionMixinLusy = {
  presetFieldsFromAddressLusy(transaction: SalesTransaction): void {
    transaction.custbody_deliveryapptrequired =
      transaction.shippingaddress.custrecord_deliveryappt;
    transaction.custbody_callahead =
      transaction.shippingaddress.custrecord_callahead;
    transaction.custbody_liftgaterequired =
      transaction.shippingaddress.custrecord_liftgate;
    transaction.custbody_shipblind =
      transaction.shippingaddress.custrecord_shipblind;
  },
};
