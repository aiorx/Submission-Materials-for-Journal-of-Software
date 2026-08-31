```js
app.get("/acceptPeopleInterested/:userId/:itemId", async (req, res) => {
  var userId = req.params.userId;
  var itemId = req.params.itemId;

  // Find the item in the database
  let item = await itemCollection.findOne({ _id: new mongodb.ObjectId(itemId) });

  /**
   *  Accept or unaccept the person interested in the item
   * 
   *  Supported via standard GitHub programming aids
   *  @author: Copilot
   */
  if (item.personaccepted == userId) {
    // If personaccepted is equal to userId, remove it
    await itemCollection.updateOne(
      { _id: new mongodb.ObjectId(itemId) },
      { $set: { personaccepted: "", status: "Available" } }
    );
  } else {
    // If personaccepted is not equal to userId, set it
    await itemCollection.updateOne(
      { _id: new mongodb.ObjectId(itemId) },
      { $set: { personaccepted: userId, status: "Pending Exchange" } }
    );
  }

  //For notification
  //Find the user in the database
  const personaccepted = await userCollection.findOne({ _id: new mongodb.ObjectId(userId) });

  //item owner
  const itemOwner = await userCollection.findOne({ _id: new mongodb.ObjectId(item.user_id) });

  // Find the notification from person accepted's notifications array
  let notificationIndex = personaccepted.notifications.findIndex(notification =>
    notification.itemId === itemId);

  if (notificationIndex !== -1) {
    // The notification exists, remove it
    personaccepted.notifications.splice(notificationIndex, 1);

    // Update the user document in the database
    await userCollection.updateOne({ _id: personaccepted._id },
      { $set: { notifications: personaccepted.notifications } });

  } else {
    // The notification does not exist, create it
    let notification = {
      itemId: itemId,
      message: `Your interest in ${item.title} has been accepted by ${itemOwner.username}.`,
      date: new Date()
    };

    // Add the notification to the person accepted's notifications array
    personaccepted.notifications.push(notification);

    // Update the person accepted document in the database
    await userCollection.updateOne({ _id: personaccepted._id },
      { $set: { notifications: personaccepted.notifications } });

  }

  // Redirect back to the item page
  res.redirect("/peopleInterested/" + itemId);
});
```