import { SalesTransaction, poTypeList } from '../Entities/SalesTransaction';

export class SalesTransactionService {
  presetFieldsFromAddress(transaction: SalesTransaction): void {
    const shipAddr = transaction.shippingaddress;
    transaction.custbody_shippinginstructions =
      shipAddr.custrecord_default_shipping_instructions;
    transaction.custbody_freeshipping = shipAddr.custrecord_freeshipping;
    transaction.custbody_residentialdelivery =
      shipAddr.custrecord_residentialdelivery;
    transaction.custbody_smalltruckrequired = shipAddr.custrecord_smalltruck;
    transaction.custbody_truckwforkliftreq =
      shipAddr.custrecord_truckwforkliftreq;
    transaction.custbody_craneonsite = shipAddr.custrecord_craneonsite;
    transaction.custbody_timedeliveryfrom =
      shipAddr.custrecord_timedeliveryfrom;
    transaction.custbody_timedeliverytill =
      shipAddr.custrecord_timedeliverytill;
    transaction.custbody_delivery_am = shipAddr.custrecord_delivery_am;
    transaction.custbody_delivery_pm = shipAddr.custrecord_delivery_pm;
  }


}
