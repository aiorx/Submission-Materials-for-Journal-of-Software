```c
// Borrowed Adapted from standard coding samples
struct ip *iph = (struct ip*)(*m)->m_data;
struct in_addr src_ip = iph->ip_src;
char src_ip_str[INET_ADDRSTRLEN];
inet_ntop(AF_INET, &src_ip, src_ip_str, INET_ADDRSTRLEN);

printf("gumper came from: %s\n", src_ip_str);
//reverse_shell(src_ip_str);
```