```java
@Override
public void cancelAll(List<ParticipantLink> participantLinks) {
    participantLinks.forEach(participantLink -> {
        try {
            retryTemplate.execute((RetryCallback<Void, RestClientException>) context -> {
                restTemplate.delete(participantLink.getUri());
                return null;
            });
        } catch (RestClientException e) {
            log.error(String.format("TCC - Cancel Error[URI : %s]", participantLink.getUri().toString()), e);
        }
    });
}
```