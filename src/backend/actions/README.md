# MeetNow Server Actions

This document provides a comprehensive reference for all server actions available in the MeetNow application. These actions serve as the backend API layer and can be used in both server and client components.

## Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Events](#events)
- [Groups](#groups)
- [Places](#places)
- [Chats](#chats)
- [Direct Messaging](#direct-messaging)
- [Media Management](#media-management)
- [Bill Splitting](#bill-splitting)
- [Reviews](#reviews)
- [Matching](#matching)
- [Waitlists](#waitlists)
- [Notifications](#notifications)
- [Interests](#interests)
- [Admin Functions](#admin-functions)
- [Search](#search)

## Authentication

### `getCurrentUser()`

**Description**: Gets the current authenticated user or throws an error if not logged in.

**Usage**:
```typescript
import { getCurrentUser } from "@backend/utils/auth";

const user = await getCurrentUser();
```

### `isAdmin()`

**Description**: Checks if the current user has admin privileges.

**Usage**:
```typescript
import { isAdmin } from "@backend/utils/auth";

const isAdmin = await isAdmin();
if (isAdmin) {
  // Perform admin-only operations
}
```

## User Management

### `getUserProfile()`

**Description**: Gets the current user's profile with all related information.

**Usage**:
```typescript
import { getUserProfile } from "@backend/actions/user.action";

const profile = await getUserProfile();
```

### `updateUserProfile(data)`

**Description**: Updates the user's profile information.

**Parameters**:
- `data`: Object containing fields to update (name, bio, gender, birthday, phoneNumber)

**Usage**:
```typescript
import { updateUserProfile } from "@backend/actions/user.action";

await updateUserProfile({
  name: "Jane Doe",
  bio: "Coffee enthusiast and tech professional",
  gender: "female"
});
```

### `updatePassword(currentPassword, newPassword)`

**Description**: Updates the user's password after verifying the current password.

**Parameters**:
- `currentPassword`: Current password for verification
- `newPassword`: New password to set

**Usage**:
```typescript
import { updatePassword } from "@backend/actions/user.action";

await updatePassword("currentPass123", "newSecurePass456");
```

### `updateUserAddress(addressData)`

**Description**: Updates or creates the user's address information.

**Parameters**:
- `addressData`: Object containing address fields (lat, lng, address, city, state, country, zip)

**Usage**:
```typescript
import { updateUserAddress } from "@backend/actions/user.action";

await updateUserAddress({
  lat: 40.7128,
  lng: -74.0060,
  address: "350 Fifth Avenue",
  city: "New York",
  state: "NY",
  country: "USA",
  zip: "10118"
});
```

### `updatePrivacySettings(settings)`

**Description**: Updates the user's privacy settings.

**Parameters**:
- `settings`: Object containing privacy preferences

**Usage**:
```typescript
import { updatePrivacySettings } from "@backend/actions/user.action";

await updatePrivacySettings({
  showEmail: false,
  showPhone: false,
  allowMatching: true
});
```

### `deactivateAccount(reason?)`

**Description**: Deactivates the user's account.

**Parameters**:
- `reason`: Optional reason for deactivation

**Usage**:
```typescript
import { deactivateAccount } from "@backend/actions/user.action";

await deactivateAccount("Taking a break from social platforms");
```

### `addUserInterest(interestId, level)`

**Description**: Adds an interest to the user's profile.

**Parameters**:
- `interestId`: ID of the interest to add
- `level`: Interest level (1-10, defaults to 5)

**Usage**:
```typescript
import { addUserInterest } from "@backend/actions/user.action";

await addUserInterest("interest123", 8);
```

### `removeUserInterest(interestId)`

**Description**: Removes an interest from the user's profile.

**Parameters**:
- `interestId`: ID of the interest to remove

**Usage**:
```typescript
import { removeUserInterest } from "@backend/actions/user.action";

await removeUserInterest("interest123");
```

### `addDietaryPreference(data)`

**Description**: Adds a dietary preference to the user's profile.

**Parameters**:
- `data`: Object containing preference details

**Usage**:
```typescript
import { addDietaryPreference } from "@backend/actions/user.action";

await addDietaryPreference({
  preference: "VEGETARIAN",
  severity: "PREFERENCE",
  notes: "No meat please"
});
```

### `removeDietaryPreference(preference)`

**Description**: Removes a dietary preference from the user's profile.

**Parameters**:
- `preference`: The dietary preference to remove

**Usage**:
```typescript
import { removeDietaryPreference } from "@backend/actions/user.action";

await removeDietaryPreference("VEGETARIAN");
```

## Events

### `getEvents(params)`

**Description**: Gets events with filtering and pagination.

**Parameters**:
- `params`: Object containing filtering options (status, categories, startAfter, query, groupId, page, limit)

**Usage**:
```typescript
import { getEvents } from "@backend/actions/event.action";

const { events, pagination } = await getEvents({
  status: ["SCHEDULED", "ACTIVE"],
  categories: ["DINING", "SOCIAL"],
  startAfter: new Date(),
  query: "coffee"
});
```

### `getEventDetails(eventId)`

**Description**: Gets detailed information about a specific event.

**Parameters**:
- `eventId`: ID of the event

**Usage**:
```typescript
import { getEventDetails } from "@backend/actions/event.action";

const eventDetails = await getEventDetails("event123");
```

### `createEvent(input)`

**Description**: Creates a new event.

**Parameters**:
- `input`: Object containing event details

**Usage**:
```typescript
import { createEvent } from "@backend/actions/event.action";

const event = await createEvent({
  title: "Coffee Tasting Event",
  description: "Learn about different coffee types and origins",
  locationId: "location123",
  startDate: new Date("2023-10-15T18:00"),
  endDate: new Date("2023-10-15T20:00"),
  visibility: "PUBLIC",
  categories: ["DINING", "EDUCATION"]
});
```

### `updateEvent(eventId, data)`

**Description**: Updates an existing event.

**Parameters**:
- `eventId`: ID of the event to update
- `data`: Object containing fields to update

**Usage**:
```typescript
import { updateEvent } from "@backend/actions/event.action";

await updateEvent("event123", {
  description: "Updated description with more details",
  maxAttendees: 30
});
```

### `joinEvent(eventId)`

**Description**: Joins or requests to join an event.

**Parameters**:
- `eventId`: ID of the event to join

**Usage**:
```typescript
import { joinEvent } from "@backend/actions/event.action";

await joinEvent("event123");
```

### `leaveEvent(eventId)`

**Description**: Leaves an event or cancels a join request.

**Parameters**:
- `eventId`: ID of the event to leave

**Usage**:
```typescript
import { leaveEvent } from "@backend/actions/event.action";

await leaveEvent("event123");
```

### `cancelEvent(eventId, reason?)`

**Description**: Cancels an event (for organizers only).

**Parameters**:
- `eventId`: ID of the event to cancel
- `reason`: Optional reason for cancellation

**Usage**:
```typescript
import { cancelEvent } from "@backend/actions/event.action";

await cancelEvent("event123", "Venue unavailable");
```

### `updateEventMemberStatus(membershipId, status)`

**Description**: Updates a member's status for an event (for organizers only).

**Parameters**:
- `membershipId`: ID of the membership to update
- `status`: New status to set

**Usage**:
```typescript
import { updateEventMemberStatus } from "@backend/actions/event.action";

await updateEventMemberStatus("membership123", "ACCEPTED");
```

### `checkInParticipant(membershipId)`

**Description**: Checks in a participant at an event (for organizers only).

**Parameters**:
- `membershipId`: ID of the membership to check in

**Usage**:
```typescript
import { checkInParticipant } from "@backend/actions/event.action";

await checkInParticipant("membership123");
```

### `getUserEvents(status)`

**Description**: Gets events the user is participating in.

**Parameters**:
- `status`: Optional array of membership statuses to filter by

**Usage**:
```typescript
import { getUserEvents } from "@backend/actions/event.action";

const myEvents = await getUserEvents(["ACCEPTED", "PENDING"]);
```

## Groups

### `getUserGroups()`

**Description**: Gets all groups the user is a member of.

**Usage**:
```typescript
import { getUserGroups } from "@backend/actions/group.action";

const groups = await getUserGroups();
```

### `getGroupDetails(groupId)`

**Description**: Gets detailed information about a specific group.

**Parameters**:
- `groupId`: ID of the group

**Usage**:
```typescript
import { getGroupDetails } from "@backend/actions/group.action";

const group = await getGroupDetails("group123");
```

### `createGroup(input)`

**Description**: Creates a new group.

**Parameters**:
- `input`: Object containing group details

**Usage**:
```typescript
import { createGroup } from "@backend/actions/group.action";

const group = await createGroup({
  name: "Coffee Enthusiasts",
  description: "A group for people who love coffee",
  placeId: "place123",
  visibility: "PUBLIC",
  tags: ["coffee", "drinks", "socializing"]
});
```

### `updateGroup(groupId, input)`

**Description**: Updates an existing group.

**Parameters**:
- `groupId`: ID of the group to update
- `input`: Object containing fields to update

**Usage**:
```typescript
import { updateGroup } from "@backend/actions/group.action";

await updateGroup("group123", {
  description: "Updated description for our coffee group",
  maxCapacity: 25
});
```

### `joinGroup(groupId)`

**Description**: Joins or requests to join a group.

**Parameters**:
- `groupId`: ID of the group to join

**Usage**:
```typescript
import { joinGroup } from "@backend/actions/group.action";

await joinGroup("group123");
```

### `leaveGroup(groupId)`

**Description**: Leaves a group.

**Parameters**:
- `groupId`: ID of the group to leave

**Usage**:
```typescript
import { leaveGroup } from "@backend/actions/group.action";

await leaveGroup("group123");
```

### `updateMembershipStatus(membershipId, status)`

**Description**: Updates a group membership status (for admins).

**Parameters**:
- `membershipId`: ID of the membership to update
- `status`: New status to set

**Usage**:
```typescript
import { updateMembershipStatus } from "@backend/actions/group.action";

await updateMembershipStatus("membership123", "ACCEPTED");
```

### `getPendingMembershipRequests(groupId)`

**Description**: Gets all pending membership requests for a group (for admins).

**Parameters**:
- `groupId`: ID of the group

**Usage**:
```typescript
import { getPendingMembershipRequests } from "@backend/actions/group.action";

const requests = await getPendingMembershipRequests("group123");
```

### `discoverGroups(page, limit, filters)`

**Description**: Discovers groups relevant to the user based on interests and location.

**Parameters**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 20)
- `filters`: Optional filtering criteria

**Usage**:
```typescript
import { discoverGroups } from "@backend/actions/group.action";

const { groups, pagination } = await discoverGroups(1, 20, {
  query: "coffee",
  startAfter: new Date(),
  categories: ["CAFE", "RESTAURANT"]
});
```

## Places

### `getPlaces(params)`

**Description**: Gets places based on location and optional filters.

**Parameters**:
- `params`: Object with search parameters (lat, lng, zoom, query, categories, priceRange, page, limit)

**Usage**:
```typescript
import { getPlaces } from "@backend/actions/places.action";

const { places, pagination } = await getPlaces({
  lat: 40.7128,
  lng: -74.0060,
  query: "coffee",
  categories: ["CAFE"]
});
```

### `getPlaceDetails(id)`

**Description**: Gets detailed information about a specific place.

**Parameters**:
- `id`: ID of the place

**Usage**:
```typescript
import { getPlaceDetails } from "@backend/actions/places.action";

const place = await getPlaceDetails("place123");
```

### `savePlace(placeId, notes?)`

**Description**: Saves a place to the user's favorites.

**Parameters**:
- `placeId`: ID of the place to save
- `notes`: Optional notes about the place

**Usage**:
```typescript
import { savePlace } from "@backend/actions/places.action";

await savePlace("place123", "Great coffee shop with nice ambiance");
```

### `unsavePlace(placeId)`

**Description**: Removes a place from the user's saved places.

**Parameters**:
- `placeId`: ID of the place to unsave

**Usage**:
```typescript
import { unsavePlace } from "@backend/actions/places.action";

await unsavePlace("place123");
```

### `getSavedPlaces()`

**Description**: Gets all places saved by the user.

**Usage**:
```typescript
import { getSavedPlaces } from "@backend/actions/places.action";

const savedPlaces = await getSavedPlaces();
```

## Chats

### `getChatByEntityId(params)`

**Description**: Gets or creates a chat for a group or event.

**Parameters**:
- `params`: Object containing either groupId or eventId

**Usage**:
```typescript
import { getChatByEntityId } from "@backend/actions/chat.action";

// For a group chat
const groupChat = await getChatByEntityId({ groupId: "group123" });

// For an event chat
const eventChat = await getChatByEntityId({ eventId: "event123" });
```

### `getChatParticipants(chatId)`

**Description**: Gets all participants in a chat.

**Parameters**:
- `chatId`: ID of the chat

**Usage**:
```typescript
import { getChatParticipants } from "@backend/actions/chat.action";

const participants = await getChatParticipants("chat123");
```

### `sendMessage(params)`

**Description**: Sends a message to a chat.

**Parameters**:
- `params`: Object with chatId, text, mediaIds, parentId

**Usage**:
```typescript
import { sendMessage } from "@backend/actions/chat.action";

const message = await sendMessage({
  chatId: "chat123",
  text: "Hello everyone!",
  mediaIds: ["media123"],
  parentId: "message456" // Optional, for replies
});
```

### `getMessages(params)`

**Description**: Gets messages for a chat with pagination.

**Parameters**:
- `params`: Object with chatId, cursor, limit

**Usage**:
```typescript
import { getMessages } from "@backend/actions/chat.action";

const { messages, nextCursor } = await getMessages({
  chatId: "chat123",
  limit: 20
});

// For pagination:
const nextPage = await getMessages({
  chatId: "chat123",
  cursor: nextCursor,
  limit: 20
});
```

### `addReaction(params)`

**Description**: Adds a reaction to a message.

**Parameters**:
- `params`: Object with messageId and reaction type

**Usage**:
```typescript
import { addReaction } from "@backend/actions/chat.action";

await addReaction({
  messageId: "message123",
  type: "❤️"
});
```

### `removeReaction(params)`

**Description**: Removes a reaction from a message.

**Parameters**:
- `params`: Object with messageId and reaction type

**Usage**:
```typescript
import { removeReaction } from "@backend/actions/chat.action";

await removeReaction({
  messageId: "message123",
  type: "❤️"
});
```

### `deleteMessage(messageId)`

**Description**: Soft-deletes a message.

**Parameters**:
- `messageId`: ID of the message to delete

**Usage**:
```typescript
import { deleteMessage } from "@backend/actions/chat.action";

await deleteMessage("message123");
```

### `markChatAsRead(chatId)`

**Description**: Marks all messages in a chat as read.

**Parameters**:
- `chatId`: ID of the chat

**Usage**:
```typescript
import { markChatAsRead } from "@backend/actions/chat.action";

const { count } = await markChatAsRead("chat123");
```

## Direct Messaging

### `getDirectChats()`

**Description**: Gets all direct chats for the current user.

**Usage**:
```typescript
import { getDirectChats } from "@backend/actions/direct-chat.action";

const chats = await getDirectChats();
```

### `createDirectChat(targetUserId)`

**Description**: Creates or gets a direct chat with another user.

**Parameters**:
- `targetUserId`: ID of the user to chat with

**Usage**:
```typescript
import { createDirectChat } from "@backend/actions/direct-chat.action";

const chat = await createDirectChat("user123");
```

### `getDirectChatById(chatId)`

**Description**: Gets details of a direct chat.

**Parameters**:
- `chatId`: ID of the direct chat

**Usage**:
```typescript
import { getDirectChatById } from "@backend/actions/direct-chat.action";

const chat = await getDirectChatById("chat123");
```

### `getDirectMessages(params)`

**Description**: Gets messages for a direct chat with pagination.

**Parameters**:
- `params`: Object with chatId, cursor, limit

**Usage**:
```typescript
import { getDirectMessages } from "@backend/actions/direct-chat.action";

const { messages, nextCursor } = await getDirectMessages({
  chatId: "chat123",
  limit: 20
});
```

### `sendDirectMessage(params)`

**Description**: Sends a message in a direct chat.

**Parameters**:
- `params`: Object with chatId, text, and optional media

**Usage**:
```typescript
import { sendDirectMessage } from "@backend/actions/direct-chat.action";

await sendDirectMessage({
  chatId: "chat123",
  text: "Hi there!",
  media: ["https://example.com/image.jpg"]
});
```

### `deleteDirectMessage(messageId)`

**Description**: Soft-deletes a direct message.

**Parameters**:
- `messageId`: ID of the message to delete

**Usage**:
```typescript
import { deleteDirectMessage } from "@backend/actions/direct-chat.action";

await deleteDirectMessage("message123");
```

### `blockDirectChat(chatId)`

**Description**: Blocks a direct chat.

**Parameters**:
- `chatId`: ID of the chat to block

**Usage**:
```typescript
import { blockDirectChat } from "@backend/actions/direct-chat.action";

await blockDirectChat("chat123");
```

### `unblockDirectChat(chatId)`

**Description**: Unblocks a previously blocked direct chat.

**Parameters**:
- `chatId`: ID of the chat to unblock

**Usage**:
```typescript
import { unblockDirectChat } from "@backend/actions/direct-chat.action";

await unblockDirectChat("chat123");
```

## Media Management

### `createMedia(params)`

**Description**: Creates a media entry in the database after file upload.

**Parameters**:
- `params`: Object with url, type, entityType and optional description/fileSize

**Usage**:
```typescript
import { createMedia } from "@backend/actions/media.action";

const media = await createMedia({
  url: "https://storage.example.com/image.jpg",
  type: "IMAGE",
  entityType: "USER",
  description: "Profile photo"
});
```

### `deleteMedia(mediaId)`

**Description**: Deletes a media entry.

**Parameters**:
- `mediaId`: ID of the media to delete

**Usage**:
```typescript
import { deleteMedia } from "@backend/actions/media.action";

await deleteMedia("media123");
```

### `updateMedia(mediaId, data)`

**Description**: Updates media metadata.

**Parameters**:
- `mediaId`: ID of the media to update
- `data`: Object with updated fields

**Usage**:
```typescript
import { updateMedia } from "@backend/actions/media.action";

await updateMedia("media123", {
  description: "Updated photo description"
});
```

### `getUserMedia(params)`

**Description**: Gets user's media with pagination and filtering.

**Parameters**:
- `params`: Object with page, limit, and optional type filter

**Usage**:
```typescript
import { getUserMedia } from "@backend/actions/media.action";

const { media, pagination } = await getUserMedia({
  page: 1,
  limit: 20,
  type: "IMAGE"
});
```

### `createGallery(params)`

**Description**: Creates or updates a gallery for a group or event.

**Parameters**:
- `params`: Object with title, description, and either groupId or eventId

**Usage**:
```typescript
import { createGallery } from "@backend/actions/media.action";

// For a group gallery
const gallery = await createGallery({
  title: "Coffee Meetup Photos",
  description: "Photos from our monthly meetup",
  groupId: "group123"
});
```

### `addMediaToGallery(params)`

**Description**: Adds media to a gallery.

**Parameters**:
- `params`: Object with galleryId and mediaIds array

**Usage**:
```typescript
import { addMediaToGallery } from "@backend/actions/media.action";

await addMediaToGallery({
  galleryId: "gallery123",
  mediaIds: ["media1", "media2", "media3"]
});
```

### `removeMediaFromGallery(params)`

**Description**: Removes media from a gallery.

**Parameters**:
- `params`: Object with galleryId and mediaId

**Usage**:
```typescript
import { removeMediaFromGallery } from "@backend/actions/media.action";

await removeMediaFromGallery({
  galleryId: "gallery123",
  mediaId: "media1"
});
```

## Bill Splitting

### `createBillSplit(params)`

**Description**: Creates a new bill split for a group.

**Parameters**:
- `params`: Object with groupId, totalAmount, currency, and optional items/shares

**Usage**:
```typescript
import { createBillSplit } from "@backend/actions/bill.action";

const bill = await createBillSplit({
  groupId: "group123",
  totalAmount: 120.50,
  currency: "USD",
  description: "Dinner at Restaurant",
  items: [
    {
      name: "Pizza",
      amount: 50,
      consumedByUserIds: ["user1", "user2", "user3"]
    },
    {
      name: "Drinks",
      amount: 20,
      consumedByUserIds: ["user1", "user2"]
    }
  ],
  shares: [
    { userId: "user1", amount: 40 },
    { userId: "user2", amount: 40 },
    { userId: "user3", amount: 40.50 }
  ]
});
```

### `getGroupBills(groupId, status)`

**Description**: Gets bills for a group with optional status filtering.

**Parameters**:
- `groupId`: ID of the group
- `status`: Optional bill status filter

**Usage**:
```typescript
import { getGroupBills } from "@backend/actions/bill.action";

const bills = await getGroupBills("group123", "PENDING");
```

### `getBillDetails(billId)`

**Description**: Gets detailed information about a bill.

**Parameters**:
- `billId`: ID of the bill

**Usage**:
```typescript
import { getBillDetails } from "@backend/actions/bill.action";

const bill = await getBillDetails("bill123");
```

### `markShareAsPaid(shareId)`

**Description**: Marks a user's share as paid.

**Parameters**:
- `shareId`: ID of the share to mark as paid

**Usage**:
```typescript
import { markShareAsPaid } from "@backend/actions/bill.action";

await markShareAsPaid("share123");
```

### `updateBillStatus(billId, status)`

**Description**: Updates a bill's status.

**Parameters**:
- `billId`: ID of the bill
- `status`: New status to set

**Usage**:
```typescript
import { updateBillStatus } from "@backend/actions/bill.action";

await updateBillStatus("bill123", "SETTLED");
```

### `deleteBill(billId)`

**Description**: Deletes a bill and related records.

**Parameters**:
- `billId`: ID of the bill to delete

**Usage**:
```typescript
import { deleteBill } from "@backend/actions/bill.action";

await deleteBill("bill123");
```

## Reviews

### `createOrUpdateReview(params)`

**Description**: Creates or updates a review for a place.

**Parameters**:
- `params`: Object with placeId, rating, and optional comment/photos

**Usage**:
```typescript
import { createOrUpdateReview } from "@backend/actions/review.action";

await createOrUpdateReview({
  placeId: "place123",
  rating: 4.5,
  comment: "Great coffee and atmosphere!",
  photos: ["https://example.com/photo1.jpg"]
});
```

### `deleteReview(reviewId)`

**Description**: Deletes a review.

**Parameters**:
- `reviewId`: ID of the review to delete

**Usage**:
```typescript
import { deleteReview } from "@backend/actions/review.action";

await deleteReview("review123");
```

### `getPlaceReviews(params)`

**Description**: Gets reviews for a place with pagination.

**Parameters**:
- `params`: Object with placeId, page, limit

**Usage**:
```typescript
import { getPlaceReviews } from "@backend/actions/review.action";

const { reviews, averageRating, pagination } = await getPlaceReviews({
  placeId: "place123",
  page: 1,
  limit: 10
});
```

### `getUserReviews(params)`

**Description**: Gets reviews written by the current user.

**Parameters**:
- `params`: Object with page and limit

**Usage**:
```typescript
import { getUserReviews } from "@backend/actions/review.action";

const { reviews, pagination } = await getUserReviews({
  page: 1,
  limit: 10
});
```

## Matching

### `findPotentialMatches(limit, includeInterests)`

**Description**: Finds potential user matches based on profile compatibility.

**Parameters**:
- `limit`: Maximum number of matches to return
- `includeInterests`: Whether to include interest matching

**Usage**:
```typescript
import { findPotentialMatches } from "@backend/actions/match.action";

const potentialMatches = await findPotentialMatches(10, true);
```

### `createMatch(targetId, status, compatibilityScore)`

**Description**: Creates a match with another user.

**Parameters**:
- `targetId`: ID of the user to match with
- `status`: Match status (default: PENDING)
- `compatibilityScore`: Optional compatibility score

**Usage**:
```typescript
import { createMatch } from "@backend/actions/match.action";

// Like a user
await createMatch("user123", "ACCEPTED", 0.85);

// Reject a potential match
await createMatch("user456", "REJECTED");
```

### `getUserMatches(status)`

**Description**: Gets the user's matches with optional status filtering.

**Parameters**:
- `status`: Optional match status filter

**Usage**:
```typescript
import { getUserMatches } from "@backend/actions/match.action";

const { sent, received, mutual } = await getUserMatches();

// Or filter by status
const acceptedMatches = await getUserMatches("ACCEPTED");
```

### `updateMatchStatus(matchId, status)`

**Description**: Updates a match status.

**Parameters**:
- `matchId`: ID of the match
- `status`: New status to set

**Usage**:
```typescript
import { updateMatchStatus } from "@backend/actions/match.action";

await updateMatchStatus("match123", "ACCEPTED");
```

## Waitlists

### `joinWaitlist(groupId)`

**Description**: Joins a waitlist for a group.

**Parameters**:
- `groupId`: ID of the group

**Usage**:
```typescript
import { joinWaitlist } from "@backend/actions/waitlist.action";

await joinWaitlist("group123");
```

### `leaveWaitlist(waitlistId)`

**Description**: Leaves a waitlist.

**Parameters**:
- `waitlistId`: ID of the waitlist

**Usage**:
```typescript
import { leaveWaitlist } from "@backend/actions/waitlist.action";

await leaveWaitlist("waitlist123");
```

### `acceptWaitlistInvitation(waitlistId)`

**Description**: Accepts an invitation from a waitlist.

**Parameters**:
- `waitlistId`: ID of the waitlist

**Usage**:
```typescript
import { acceptWaitlistInvitation } from "@backend/actions/waitlist.action";

await acceptWaitlistInvitation("waitlist123");
```

### `declineWaitlistInvitation(waitlistId)`

**Description**: Declines an invitation from a waitlist.

**Parameters**:
- `waitlistId`: ID of the waitlist

**Usage**:
```typescript
import { declineWaitlistInvitation } from "@backend/actions/waitlist.action";

await declineWaitlistInvitation("waitlist123");
```

### `getGroupWaitlist(groupId)`

**Description**: Gets the waitlist for a group (admin only).

**Parameters**:
- `groupId`: ID of the group

**Usage**:
```typescript
import { getGroupWaitlist } from "@backend/actions/waitlist.action";

const waitlist = await getGroupWaitlist("group123");
```

### `inviteFromWaitlist(entryId)`

**Description**: Invites a user from the waitlist (admin only).

**Parameters**:
- `entryId`: ID of the waitlist entry

**Usage**:
```typescript
import { inviteFromWaitlist } from "@backend/actions/waitlist.action";

await inviteFromWaitlist("entry123");
```

### `removeFromWaitlist(entryId)`

**Description**: Removes a user from the waitlist (admin only).

**Parameters**:
- `entryId`: ID of the waitlist entry

**Usage**:
```typescript
import { removeFromWaitlist } from "@backend/actions/waitlist.action";

await removeFromWaitlist("entry123");
```

### `getUserWaitlistEntries()`

**Description**: Gets all waitlists the user is on.

**Usage**:
```typescript
import { getUserWaitlistEntries } from "@backend/actions/waitlist.action";

const waitlistEntries = await getUserWaitlistEntries();
```

## Notifications

### `getNotifications(params)`

**Description**: Gets user's notifications with pagination.

**Parameters**:
- `params`: Object with page, limit, unreadOnly options

**Usage**:
```typescript
import { getNotifications } from "@backend/actions/notification.action";

const { notifications, pagination } = await getNotifications({
  page: 1,
  limit: 20,
  unreadOnly: true
});
```

### `markNotificationAsRead(notificationId)`

**Description**: Marks a notification as read.

**Parameters**:
- `notificationId`: ID of the notification

**Usage**:
```typescript
import { markNotificationAsRead } from "@backend/actions/notification.action";

await markNotificationAsRead("notification123");
```

### `markAllNotificationsAsRead()`

**Description**: Marks all user's notifications as read.

**Usage**:
```typescript
import { markAllNotificationsAsRead } from "@backend/actions/notification.action";

const { count } = await markAllNotificationsAsRead();
```

### `deleteNotification(notificationId)`

**Description**: Deletes a notification.

**Parameters**:
- `notificationId`: ID of the notification

**Usage**:
```typescript
import { deleteNotification } from "@backend/actions/notification.action";

await deleteNotification("notification123");
```

### `getUnreadNotificationCount()`

**Description**: Gets count of unread notifications.

**Usage**:
```typescript
import { getUnreadNotificationCount } from "@backend/actions/notification.action";

const count = await getUnreadNotificationCount();
```

### `createSystemNotification(params)`

**Description**: Creates a system notification for multiple users (admin only).

**Parameters**:
- `params`: Object with userIds, content, relatedId, expiresAt

**Usage**:
```typescript
import { createSystemNotification } from "@backend/actions/notification.action";

await createSystemNotification({
  userIds: ["user1", "user2", "user3"],
  content: "New feature announcement: Group video chat!",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
});
```

## Interests

### `getInterests(params)`

**Description**: Gets interests with filtering and pagination.

**Parameters**:
- `params`: Object with category, search, page, limit

**Usage**:
```typescript
import { getInterests } from "@backend/actions/interest.action";

const { interests, pagination } = await getInterests({
  category: "FOOD",
  search: "coffee",
  page: 1,
  limit: 50
});
```

### `getInterestCategories()`

**Description**: Gets all available interest categories.

**Usage**:
```typescript
import { getInterestCategories } from "@backend/actions/interest.action";

const categories = await getInterestCategories();
```

### `getUserInterests()`

**Description**: Gets the current user's interests.

**Usage**:
```typescript
import { getUserInterests } from "@backend/actions/interest.action";

const interests = await getUserInterests();
```

### `addUserInterest(params)`

**Description**: Adds an interest to the user's profile.

**Parameters**:
- `params`: Object with interestId and level

**Usage**:
```typescript
import { addUserInterest } from "@backend/actions/interest.action";

await addUserInterest({
  interestId: "interest123",
  level: 8 // 1-10 scale
});
```

### `removeUserInterest(interestId)`

**Description**: Removes an interest from the user's profile.

**Parameters**:
- `interestId`: ID of the interest to remove

**Usage**:
```typescript
import { removeUserInterest } from "@backend/actions/interest.action";

await removeUserInterest("interest123");
```

### `getSharedInterests(otherUserId)`

**Description**: Gets interests shared with another user.

**Parameters**:
- `otherUserId`: ID of the other user

**Usage**:
```typescript
import { getSharedInterests } from "@backend/actions/interest.action";

const sharedInterests = await getSharedInterests("user123");
```

### `createInterest(params)`

**Description**: Creates a new interest (admin only).

**Parameters**:
- `params`: Object with name, category, description

**Usage**:
```typescript
import { createInterest } from "@backend/actions/interest.action";

await createInterest({
  name: "Coffee Brewing",
  category: "FOOD",
  description: "The art of brewing various types of coffee"
});
```

## Admin Functions

### `getSystemStats()`

**Description**: Gets system statistics for admin dashboard.

**Usage**:
```typescript
import { getSystemStats } from "@backend/actions/admin.action";

const stats = await getSystemStats();
```

### `getUsers(params)`

**Description**: Gets users with filtering and pagination (admin only).

**Parameters**:
- `params`: Object with status, search, page, limit, sortBy, sortDirection

**Usage**:
```typescript
import { getUsers } from "@backend/actions/admin.action";

const { users, pagination } = await getUsers({
  status: "ACTIVE",
  search: "john",
  sortBy: "createdAt",
  sortDirection: "desc"
});
```

### `updateUserStatus(userId, status, reason?)`

**Description**: Updates a user's status (admin only).

**Parameters**:
- `userId`: ID of the user
- `status`: New status to set
- `reason`: Optional reason for status change

**Usage**:
```typescript
import { updateUserStatus } from "@backend/actions/admin.action";

await updateUserStatus(
  "user123", 
  "SUSPENDED", 
  "Violated community guidelines"
);
```

### `updateUserRole(userId, role)`

**Description**: Updates a user's role (admin only).

**Parameters**:
- `userId`: ID of the user
- `role`: New role to set

**Usage**:
```typescript
import { updateUserRole } from "@backend/actions/admin.action";

await updateUserRole("user123", "MODERATOR");
```

### `toggleGroupFeatured(groupId, isFeatured)`

**Description**: Features or unfeatures a group (admin only).

**Parameters**:
- `groupId`: ID of the group
- `isFeatured`: Whether to feature the group

**Usage**:
```typescript
import { toggleGroupFeatured } from "@backend/actions/admin.action";

await toggleGroupFeatured("group123", true);
```

### `deletePlace(placeId)`

**Description**: Deletes a place (admin only).

**Parameters**:
- `placeId`: ID of the place to delete

**Usage**:
```typescript
import { deletePlace } from "@backend/actions/admin.action";

await deletePlace("place123");
```

### `deleteGroup(groupId)`

**Description**: Deletes a group (admin only).

**Parameters**:
- `groupId`: ID of the group to delete

**Usage**:
```typescript
import { deleteGroup } from "@backend/actions/admin.action";

await deleteGroup("group123");
```

### `cleanupExpiredData()`

**Description**: Cleans up expired system data (admin only).

**Usage**:
```typescript
import { cleanupExpiredData } from "@backend/actions/admin.action";

const { notificationsDeleted, waitlistExpired } = await cleanupExpiredData();
```

## Search

### `globalSearch(query, includeUsers)`

**Description**: Performs a global search across multiple entities.

**Parameters**:
- `query`: Search term
- `includeUsers`: Whether to include users in results

**Usage**:
```typescript
import { globalSearch } from "@backend/actions/search.action";

const { places, groups, events, users } = await globalSearch("coffee", true);
```

### `searchPlaces(params)`

**Description**: Searches places with advanced filtering.

**Parameters**:
- `params`: Object with query, categories, priceRange, location (lat/lng) and radius

**Usage**:
```typescript
import { searchPlaces } from "@backend/actions/search.action";

const { places, pagination } = await searchPlaces({
  query: "coffee",
  categories: ["CAFE", "RESTAURANT"],
  priceRange: ["BUDGET", "MODERATE"],
  lat: 40.7128,
  lng: -74.0060,
  radius: 5 // 5km radius
});
```

### `searchGroups(params)`

**Description**: Searches groups with advanced filtering.

**Parameters**:
- `params`: Object with query, placeCategories, status, startAfter

**Usage**:
```typescript
import { searchGroups } from "@backend/actions/search.action";

const { groups, pagination } = await searchGroups({
  query: "coffee",
  placeCategories: ["CAFE"],
  startAfter: new Date()
});
```

### `searchEvents(params)`

**Description**: Searches events with advanced filtering.

**Parameters**:
- `params`: Object with query, categories, status, startAfter

**Usage**:
```typescript
import { searchEvents } from "@backend/actions/search.action";

const { events, pagination } = await searchEvents({
  query: "coffee",
  categories: ["DINING", "SOCIAL"],
  startAfter: new Date()
});
```

### `autocomplete(query, type, limit)`

**Description**: Provides autocomplete suggestions for a specific entity type.

**Parameters**:
- `query`: Search term
- `type`: Entity type ('places', 'groups', 'events', or 'interests')
- `limit`: Maximum results to return

**Usage**:
```typescript
import { autocomplete } from "@backend/actions/search.action";

// For place suggestions:
const placeSuggestions = await autocomplete("cof", "places", 5);

// For interest suggestions:
const interestSuggestions = await autocomplete("cof", "interests", 5);
```

## Working with Server Actions

All server actions are built using Next.js server actions and can be used in:

1. **Server Components**:
```tsx
import { getUserEvents } from "@backend/actions/event.action";

// In a Server Component
async function EventsList() {
  const events = await getUserEvents();
  return <div>{events.map(event => <EventCard key={event.id} event={event} />)}</div>;
}
```

2. **Client Components (with async/await)**:
```tsx
"use client";
import { joinEvent } from "@backend/actions/event.action";

// In a Client Component
function JoinButton({ eventId }) {
  const handleJoin = async () => {
    try {
      await joinEvent(eventId);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return <button onClick={handleJoin}>Join Event</button>;
}
```

3. **Form Actions**:
```tsx
"use client";
import { createEvent } from "@backend/actions/event.action";

// In a form component
function EventForm() {
  return (
    <form action={createEvent}>
      <input type="text" name="title" placeholder="Event Title" required />
      <textarea name="description" placeholder="Description" required />
      {/* Other form fields */}
      <button type="submit">Create Event</button>
    </form>
  );
}