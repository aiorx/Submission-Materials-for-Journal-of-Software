import unittest
import coverage

# for running all the testing modules and generate coverage report
# the following code is Assisted with basic coding tools.

if __name__ == "__main__":
    # Start measuring coverage
    cov = coverage.Coverage()
    cov.start()

    # Discover and run all tests in the current directory
    loader = unittest.TestLoader()
    suite = loader.discover(start_dir=".", pattern="*_test.py")

    runner = unittest.TextTestRunner()
    runner.run(suite)

    # Stop measuring coverage
    cov.stop()
    cov.save()

    # Print coverage report to the console
    cov.report()

    # Generate an HTML coverage report
    cov.html_report(directory="htmlcov")
    print("HTML coverage report generated in the 'htmlcov' directory.")