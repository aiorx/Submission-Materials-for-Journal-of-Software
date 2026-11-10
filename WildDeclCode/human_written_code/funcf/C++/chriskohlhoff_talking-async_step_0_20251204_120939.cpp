```cpp
void write_to_server(std::size_t n)
{
  auto self = shared_from_this();
  async_write(
      server_,
      buffer(data_from_client_, n),
      [self](std::error_code ec, std::size_t /*n*/)
      {
        if (!ec)
        {
          self->read_from_client();
        }
        else
        {
          self->stop();
        }
      }
    );
}
```