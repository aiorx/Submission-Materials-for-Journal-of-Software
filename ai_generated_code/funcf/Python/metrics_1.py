```python
@log
def _get_cpu_sample(self, logger: Logger) -> float:
    """
    Get a CPU usage sample.

    Args:
        logger: Logger instance for logging.

    Returns:
        CPU usage percentage.
    """
    if self.windows:
        stdout, stderr = ssh.execute_ssh_command(
            self.client,
            "(Get-Counter '\\Processor(_Total)\\% Processor Time').CounterSamples.CookedValue",
            logger=logger,
            print_output=False,
        )
    else:
        stdout, stderr = ssh.execute_ssh_command(
            self.client,
            "top -bn1 | grep '%Cpu' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'",
            logger=logger,
            print_output=False,
        )
    return float(stdout)
```
```python
@log
def _get_ram_sample(self, logger: Logger) -> float:
    """
    Get a RAM usage sample.

    Args:
        logger: Logger instance for logging.

    Returns:
        RAM usage percentage.
    """
    if self.windows:
        stdout, stderr = ssh.execute_ssh_command(
            self.client,
            "(Get-Counter '\\Memory\\% Committed Bytes In Use').CounterSamples.CookedValue",
            logger=logger,
            print_output=False,
        )
    else:
        stdout, stderr = ssh.execute_ssh_command(
            self.client,
            "free | grep Mem | awk '{print $3/$2 * 100.0}'",
            logger=logger,
            print_output=False,
        )
    return float(stdout)
```