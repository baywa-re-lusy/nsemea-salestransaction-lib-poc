import { ItemSublist, SalesTransaction } from '../Entities/SalesTransaction';
import Swal from 'sweetalert2';

export const SalesTransactionServiceEssy = {
  presetFieldsFromAddressEssy<T extends SalesTransaction>(
    transaction: T,
  ): void {
    transaction.custbody_phonecontactonsite =
      transaction.shippingaddress.addrphone;
  },

  /**
   * Validates that all lines in a sales transaction have a properly defined initial quantity.
   *
   * This function checks each item line in the transaction:
   * - If `custcol_qty_inicial` is exactly 0 → invalid
   * - If `custcol_qty_inicial` is null or undefined AND `quantity` is 0 → also invalid
   * @param transaction - The sales transaction object
   * @returns true if all item lines have valid initial quantities, false otherwise
   */
  validateReservationQuantityEssy<T extends SalesTransaction>(
    transaction: T,
  ): boolean {
    const hasInvalidQty = transaction.item.entries.some((item: ItemSublist) => {
      const initialQty = item.custcol_qty_inicial;
      const quantity = item.quantity;

      return initialQty === 0 || (initialQty == null && quantity === 0);
    });

    if (hasInvalidQty) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Initial Quantity',
        text: 'Tienes líneas de pedido con qty inicial = 0 y eso no es posible. Por favor, revísalo y vuelve a guardar tras corregirlo.',
      });
      return false;
    }

    return true;
  },

  /**
   * Calculates the total weight of a transaction in kilograms.
   * @param transaction - The sales transaction containing item entries.
   * @param poundsToKg - Conversion factor from pounds to kilograms.
   * @returns Total weight in kilograms.
   */
  calculateTotalWeightKg<T extends SalesTransaction>(
    transaction: T,
    poundsToKg: number,
  ): number {
    let totalWeightInKg = 0;

    for (const { quantity, weightinlb } of transaction.item.entries) {
      // Skip invalid or non-positive values to avoid unnecessary calculations
      if (!quantity || quantity <= 0 || !weightinlb || weightinlb <= 0) {
        continue;
      }

      // Convert weight to kilograms and multiply by quantity
      totalWeightInKg += quantity * weightinlb * poundsToKg;
    }

    return totalWeightInKg;
  },

  /**
   * Validates if the shipping weight exceeds the specified limit for certain shipping methods.
   * @param transaction - The sales transaction to validate.
   * @param shippingMethodIds - Array of shipping method IDs subject to weight restrictions.
   * @param weightLimit - Maximum allowed weight in kilograms.
   * @param poundsToKg - Conversion factor from pounds to kilograms.
   */
  validateShippingWeightLimit<T extends SalesTransaction>(
    transaction: T,
    shippingMethodIds: number[],
    weightLimit: number,
    poundsToKg: number,
  ) {
    const { shipmethod } = transaction;
    if (shippingMethodIds.includes(shipmethod ?? 0)) {
      const totalWeight = this.calculateTotalWeightKg(transaction, poundsToKg);

      if (totalWeight >= weightLimit) {
        Swal.fire({
          icon: 'warning',
          title: 'Weight Limit Exceeded',
          text: `Total shipment weight exceeds ${weightLimit} kg. Please change the shipping method to FTL and calculate the transportation cost externally.`,
        });
      }
    }
  },
};
