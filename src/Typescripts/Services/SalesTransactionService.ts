import { SalesTransaction, poTypeList } from '../Entities/SalesTransaction';
import Swal from 'sweetalert2';
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

  updateShippingCost(transaction: SalesTransaction) {
    const actualShipCosts = transaction.shippingcost;
    const fixedShippingCosts =
        transaction.shippingaddress.custrecord_fixedshippingcosts;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (transaction.custbody_potype === poTypeList.warrantyExtension) {
      transaction.shippingcost = 0;
    } else if (actualShipCosts > 0) {
      Swal.fire({
        title: 'Confirmation',
        html:
            `Do you want to overwrite the shipping costs?<br/><br/>` +
            `Actual shipping costs: ${actualShipCosts}<br/><br/>` +
            `Address shipping costs: ${fixedShippingCosts}<br/><br/>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          transaction.shippingcost = fixedShippingCosts;
        }
      });
    } else {
      transaction.shippingcost = fixedShippingCosts;
    }
  }

}
