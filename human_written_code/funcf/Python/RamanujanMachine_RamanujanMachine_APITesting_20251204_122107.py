```python
def test_ESMA_api2(self): # Test standard build configuration.
    cmd = 'ESMA -out_dir ./tmp -mode build -lhs standard -poly_deg 1 -coeff_lim 1 -no_print'
    cmd = cmd.split(' ')
    parser = main.init_parser()
    args = parser.parse_args(cmd)
    lhs = main.enumerate_over_signed_rcf_main(args)
    print('Creating enumeration not through API to compare:')
    self.assertEqual(lhs, create_standard_lhs(poly_deg=1, coefficients_limit=1, do_print=(not args.no_print)))
    print("Identical enumerations.")
    file_there = os.path.exists('./tmp')
    self.assertTrue(file_there)
    os.remove('./tmp')
    print('Successfuly removed output file')
```