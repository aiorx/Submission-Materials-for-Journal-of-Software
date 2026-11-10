var Collection = require('discord.js').Collection;
var MessageAttachment = require('discord.js').MessageAttachment;
var formatAttachmentsURL = require('../src/utils').formatAttachmentsURL;

it("should format attachment url", function () {
    const attachmentWithUrl = (url: string): MessageAttachment => {
        const mockMessageAtatchment = new MessageAttachment(Buffer.alloc(0));
        mockMessageAtatchment.url = url;
        return mockMessageAtatchment;
    };

    const mockDataCollection = new Collection<string, MessageAttachment>();

    mockDataCollection.set(
        "1",
        attachmentWithUrl("https://example.com/file.png")
    );

    expect(formatAttachmentsURL(mockDataCollection)).toBe(
        "[`Attachment-0-File`](https://example.com/file.png)"
    );

    mockDataCollection.set(
        "2",
        attachmentWithUrl("https://example.com/file2.png")
    );

    expect(formatAttachmentsURL(mockDataCollection)).toBe(
        "[`Attachment-0-File`](https://example.com/file.png)\n[`Attachment-1-File`](https://example.com/file2.png)"
    );
});
