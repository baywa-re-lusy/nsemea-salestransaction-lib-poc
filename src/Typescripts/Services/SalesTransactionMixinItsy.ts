import { SalesTransaction } from '../Entities/SalesTransaction';

export const SalesTransactionMixinItsy = {
  presetFieldsFromAddressItsy(transaction: SalesTransaction): void {
    transaction.custbody_deliveryapptrequired =
      transaction.shippingaddress.custrecord_deliveryappt;
    transaction.custbody_callahead =
      transaction.shippingaddress.custrecord_callahead;
    transaction.custbody_liftgaterequired =
      transaction.shippingaddress.custrecord_liftgate;
    transaction.custbody_shipblind =
      transaction.shippingaddress.custrecord_shipblind;

    transaction.custbody_itsy_difficult_delivery =
      transaction.shippingaddress.custrecord_itsy_difficult_delivery;
    transaction.custbody_itsy_side_unload =
      transaction.shippingaddress.custrecord_itsy_side_unload;
    transaction.custbody_itsy_manned_unloading_place =
      transaction.shippingaddress.custrecord_itsy_manned_unloading_place;
    transaction.custbody_itsy_customer_owns_a_forklift =
      transaction.shippingaddress.custrecord_itsy_customer_owns_a_forklift;
  },
};
