```python
def main(args=None):
    rclpy.init(args=args)

    mover = Mover()
    mover.readKey()

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    mover.destroy_node()
    
    rclpy.shutdown()
```