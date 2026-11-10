# Aided with basic GitHub coding tools
# -*- coding: utf-8 -*-

from odoo import models, fields


class ResCompany(models.Model):
    _inherit = "res.company"

    fiscal_printer_spooler_url = fields.Char(
        string="URL del Spooler de Impresora Fiscal",
        help="La dirección IP y puerto del servicio que se conecta a la impresora fiscal. Ejemplo: http://192.168.1.100:5000/imprimir",
    )
