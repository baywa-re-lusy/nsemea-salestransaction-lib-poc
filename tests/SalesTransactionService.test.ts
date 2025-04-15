import { describe, it, expect } from 'vitest';
import { SalesTransactionService } from '../src/Typescripts/Services/SalesTransactionService';
import { SalesTransaction } from '../src/Typescripts/Entities/SalesTransaction';
import * as record from './__mock__/N/record';

describe('AddressService', () => {
  it('should correctly preset transaction fields from the shipping address', () => {
    const transaction = new SalesTransaction();
    SalesTransactionService.presetFieldsFromAddress(transaction);
    expect(record.getSubrecord).toHaveBeenCalledTimes(1);
    expect(record.getSubrecord).toBeCalledWith({ fieldId: 'shippingaddress' });
    expect(record.setValue).toHaveBeenCalledTimes(10);
    expect(record.getValue).toHaveBeenCalledTimes(10);
  });
});
