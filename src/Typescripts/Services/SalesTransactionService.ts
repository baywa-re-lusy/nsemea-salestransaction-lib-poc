import {
  SalesTransaction,
  poTypeList,
  ItemSublist,
} from '../Entities/SalesTransaction';
import Swal from 'sweetalert2';

export class SalesTransactionService {
  /**
   * Disables the pick date field if the transaction doesn't meet shipping readiness criteria.
   * @param transaction - The sales transaction to evaluate and update.
   * @param internalCustomerIds - List of internal customer IDs exempt from the check.
   */
  disablePickDateIfNeeded(
    transaction: SalesTransaction,
    internalCustomerIds: number[],
  ) {
    const { entries } = transaction.item;

    const { totalQuantity, totalQtyCommitted } = entries.reduce(
      (acc, item: ItemSublist) => {
        if (item.commitinventory) {
          acc.totalQuantity += item.quantity ?? 0;
          acc.totalQtyCommitted += item.quantitycommitted ?? 0;
        }
        return acc;
      },
      { totalQuantity: 0, totalQtyCommitted: 0 },
    );

    const shouldDisablePickDate =
      totalQuantity !== totalQtyCommitted &&
      transaction.custbody_logisticsplanningstatus !== 1 &&
      !internalCustomerIds.includes(transaction.entity) &&
      transaction.custbody_potype !== 1;

    if (shouldDisablePickDate) {
      const previousInternalSalesStatus =
        transaction.custbody_internalsalesstatus;

      transaction.custbody_internalsalesstatus = null;
      transaction.custbody_wms_pickdate = null;
      transaction.custbody_wms_pickdate_isDisabled = true;

      if (!previousInternalSalesStatus) {
        const htmlMessage = `
        <b>This SO is not (yet) ready to ship!</b><br><br>
        "Internal Sales Status" and "Pick Date" have been removed. 
        To be able to set, please ensure that the SO is:
        <ul style="list-style: disc; text-align: left; margin-left: 30px">
          <li>Status "Pending Fulfillment"</li>
          <li>Saved at least once</li>
          <li>ALL lines are committed</li>
        </ul>`;

        Swal.fire({
          icon: 'warning',
          title: 'Not OK to ship!',
          html: htmlMessage,
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      }
    } else if (totalQuantity !== totalQtyCommitted) {
      transaction.custbody_wms_pickdate_isDisabled = false;
    }
  }

  /**
   * Updates the shipping cost of a transaction based on predefined conditions.
   * If the purchase order type is 'warrantyExtension', the cost is set to zero.
   * Otherwise, the user is prompted to confirm if they want to override the shipping cost.
   *
   * @param transaction - The sales transaction object containing shipping cost details.
   */
  updateShippingCost(transaction: SalesTransaction) {
    const actualShipCosts = transaction.shippingcost;
    const fixedShippingCosts =
      transaction.shippingaddress.custrecord_fixedshippingcosts;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (transaction.custbody_potype_name === poTypeList.warrantyExtension) {
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

  /**
   * Presets specific fields in the SalesTransaction object based on the shipping address.
   *
   * @param transaction - The sales transaction object containing shipping details.
   */
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
