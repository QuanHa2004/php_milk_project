<?php

namespace Controllers\Admin;

use Helpers\Response;
use Database\Connection;
use Models\Invoice;
use Models\Product;
use Exception;

class InvoiceController{
    public function addInvoice($data){
        $db = Connection::get();
        try {
            $db->beginTransaction();

            $invoiceData = [
                'supplier_id' => $data['supplier_id'] ?? null,
                'total_amount' => $data['total_amount'] ?? 0
            ];
            $invoice_id = Invoice::createInvoice($invoiceData);

            foreach($data['items'] as $item){
                $batch_id = Product::addProductBatch([
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'manufacturing_date' => $item['manufacturing_date'] ?? null,
                    'expiration_date' => $item['expiration_date']
                ]);

                Invoice::addInvoiceDetail([
                    'invoice_id' => $invoice_id,
                    'variant_id' => $item['variant_id'],
                    'batch_id' => $batch_id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);

                Product::updateStockQuantity($item['variant_id'], $item['quantity']);
            }

            $db->commit();
            Response::json(['success' => true, 'invoice_id' => $invoice_id]);

        } catch (Exception $e){
            $db->rollBack();
            Response::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getInvoiceList()
    {
        try {
            $invoice = Invoice::all();

            Response::json([
                'data' => $invoice
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}