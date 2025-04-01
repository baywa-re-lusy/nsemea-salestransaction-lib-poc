import { SalesTransactionService } from './SalesTransactionService';
import { SalesTransaction } from '../Entities/SalesTransaction';

export class SalesTransactionServiceEssy extends SalesTransactionService {
  presetFieldsFromAddressEssy(transaction: SalesTransaction): void {
    super.presetFieldsFromAddress(transaction);
    transaction.custbody_phonecontactonsite = transaction.shippingaddress.addrphone
  }


}
