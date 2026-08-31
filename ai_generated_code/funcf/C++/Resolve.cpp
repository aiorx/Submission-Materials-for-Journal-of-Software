```cpp
bool DirectDNSLookupIPV4(const char *dns_server_ip, const char *domain, uint32_t *ipv4_addr) {
	if (!strlen(dns_server_ip)) {
		WARN_LOG(Log::sceNet, "Direct lookup: DNS server not specified");
		return false;
	}

	if (!strlen(domain)) {
		ERROR_LOG(Log::sceNet, "Direct lookup: Can't look up an empty domain");
		return false;
	}

	std::string key = StringFromFormat("%s:%s", dns_server_ip, domain);

	auto iter = g_directDNSCache.find(key);
	if (iter != g_directDNSCache.end()) {
		INFO_LOG(Log::sceNet, "Returning cached response from direct DNS request for '%s' to DNS server '%s", domain, dns_server_ip);
		*ipv4_addr = iter->second.ipv4Address;
		return true;
	}

	SOCKET sockfd = socket(AF_INET, SOCK_DGRAM, 0);
	// Create UDP socket
	if (sockfd < 0) {
		ERROR_LOG(Log::sceNet, "Socket creation for direct DNS failed");
		return 1;
	}

	struct sockaddr_in server_addr{};
	server_addr.sin_family = AF_INET;
	server_addr.sin_port = htons(DNS_PORT);

	if (net::inet_pton(AF_INET, dns_server_ip, &server_addr.sin_addr) <= 0) {
		ERROR_LOG(Log::sceNet,"Invalid DNS server IP address %s", dns_server_ip);
		closesocket(sockfd);
		return 1;
	}

	// Build DNS query
	unsigned char buffer[1024]{};
	struct DNSHeader *dns = (struct DNSHeader *)buffer;
	dns->id = htons(0x1234);  // Random ID
	dns->flags = htons(0x0100); // Standard query
	dns->q_count = htons(1);    // One question

	unsigned char *qname = buffer + sizeof(DNSHeader);
	encode_domain_name(domain, qname);

	unsigned char *qinfo = qname + strlen((const char *)qname) + 1;
	*((uint16_t *)qinfo) = htons(DNS_QUERY_TYPE_A); // Query type: A
	*((uint16_t *)(qinfo + 2)) = htons(DNS_QUERY_CLASS_IN); // Query class: IN

	// Send DNS query
	size_t query_len = sizeof(DNSHeader) + (qinfo - buffer) + 4;
	if (sendto(sockfd, (const char *)buffer, (int)query_len, 0, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
		ERROR_LOG(Log::sceNet, "Failed to send DNS query");
		closesocket(sockfd);
		return 1;
	}

	// Receive DNS response
	socklen_t server_len = sizeof(server_addr);
	size_t response_len;
	if ((response_len = recvfrom(sockfd, (char *)buffer, sizeof(buffer), 0, (struct sockaddr *)&server_addr, &server_len)) < 0) {
		ERROR_LOG(Log::sceNet, "Failed to receive DNS response");
		closesocket(sockfd);
		return 1;
	}

	// Close socket
	closesocket(sockfd);

	// Done communicating, time to parse.
	if (!parse_dns_response(buffer, response_len, ipv4_addr)) {
		return false;
	}

	g_directDNSCache[key] = DNSCacheEntry{ *ipv4_addr };
	return true;
}
```