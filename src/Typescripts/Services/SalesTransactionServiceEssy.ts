import { ItemSublist, SalesTransaction } from '../Entities/SalesTransaction';
import Swal from 'sweetalert2';

export const SalesTransactionServiceEssy = {
  presetFieldsFromAddressEssy(transaction: SalesTransaction): void {
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
  validateReservationQuantityEssy(transaction: SalesTransaction): boolean {
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
};
