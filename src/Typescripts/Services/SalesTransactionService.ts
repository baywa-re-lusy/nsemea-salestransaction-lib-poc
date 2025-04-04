import { SalesTransaction, poTypeList } from '../Entities/SalesTransaction';
import { Nullable } from '@nsemea_lib/Core/DataAccess/NSTypedRecord';
import Swal from 'sweetalert2';

const INTERNAL_CUSTOMER_IDS = new Set([2026, 2025, 2027]);

export class SalesTransactionService {
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
   * Disables the pick date field if the total ordered quantity does not match the committed quantity.
   * Also, verifies the logistics planning status and customer type before disabling.
   *
   * @param transaction - The sales transaction object containing order and inventory details.
   */
  disablePickDateIfNeeded(transaction: SalesTransaction) {
    let totalQuantity: Nullable<number> = 0;
    let totalQtyCommitted: Nullable<number> = 0;

    transaction.item.entries.forEach((item) => {
      const quantity: number = item.quantity;
      const qtyCommitted: Nullable<number> = item.quantitycommitted;
      const commitInventoryFlag: Nullable<number> = item.commitinventory;

      if (commitInventoryFlag) {
        if (quantity && quantity > 0) {
          totalQuantity += quantity;
        }
        if (qtyCommitted && qtyCommitted > 0) {
          totalQtyCommitted += qtyCommitted;
        }
      }
    });

    if (totalQuantity !== totalQtyCommitted) {
      const planningStatus: number =
        transaction.custbody_logisticsplanningstatus;
      const poType: number = transaction.custbody_potype;
      const icCustomers: number = transaction.entity;
      const previousInternalSalesStatus =
        transaction.custbody_internalsalesstatus;

      if (
        planningStatus !== 1 &&
        !INTERNAL_CUSTOMER_IDS.has(icCustomers) &&
        poType !== 1
      ) {
        transaction.custbody_internalsalesstatus = null;
        transaction.custbody_wms_pickdate = null;
        transaction.custbody_wms_pickdate_isDisabled = true;
        if (!previousInternalSalesStatus) {
          Swal.fire({
            icon: 'warning',
            title: 'Not OK to ship!',
            html: `
            <b>This SO is not (yet) ready to ship!</b><br><br>
            "Internal Sales Status" and "Pick Date" have been removed. 
            To be able to set, please ensure that the SO is:
            <ul style="list-style: disc; text-align: left; margin-left: 30px">
              <li>Status "Pending Fulfillment"</li>
              <li>Saved at least once</li>
              <li>ALL lines are committed</li>
            </ul>`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
        }
      } else {
        transaction.custbody_wms_pickdate_isDisabled = false;
      }
    }
  }
}
