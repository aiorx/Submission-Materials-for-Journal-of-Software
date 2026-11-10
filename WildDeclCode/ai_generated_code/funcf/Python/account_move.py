```python
        # Aided with basic GitHub coding tools
        spooler_url = self.company_id.fiscal_printer_spooler_url
        if not spooler_url:
            raise UserError(
                "La URL del spooler de la impresora fiscal no está configurada en los ajustes de la compañía."
            )

        # Preparamos los datos del cliente
        # Aided with basic GitHub coding tools
        payload = {
            "customer_data": {
                "name": self.partner_id.name,
                "rif": self.partner_id.vat or "N/A",
            },
            "items": [],
        }
```