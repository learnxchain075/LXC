import express from 'express';
import {
  acceptFriendRequest,
  getFriends,
  sendFriendRequest,
  removeFriend,
  getFriendRequests
} from '../../../controller/application/friend.controller';
// import {
//   editMessage,
//   getMessages,
//   sendMessage,
//   forwardMessage
// } from '../../../controller/application/MessageController';
// import { createGroup, addGroupMember, removeGroupMember, getGroupMessages } from '../../../controller/application/group.controller';
import { blockUser, unblockUser } from '../../../controller/application/block.controller';
import { reportUser } from '../../../controller/application/report.controller';
import { editMessage, forwardMessage, getMessages, sendMessage } from '../../../controller/application/MessageController';
import { createGroup, addGroupMember, removeGroupMember, getGroupMessages } from '../../../controller/application/group.controller';
import { createRoom, generateToken } from '../../../controller/application/call.controller';
// import { createRoom, generateToken } from '../../../controller/application/call.controller';

const router = express.Router();

// ********************************Friend Routes********************************
router.post('/friend-request', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/friend-requests', getFriendRequests);
router.delete('/friend/:friendId', removeFriend);
router.get('/friends', getFriends);

// ********************************Message Routes********************************
router.post('/message', sendMessage);
router.get('/message/:channelId', getMessages);
router.put('/message/:messageId/edit', editMessage);
router.post('/message/forward', forwardMessage);

// Group routes
router.post('/group', createGroup);
router.post('/group/:groupId/member', addGroupMember);
router.delete('/group/:groupId/member/:userId', removeGroupMember);
router.get('/group/:groupId/messages', getGroupMessages);

// Block/Report
router.post('/block', blockUser);
router.delete('/block', unblockUser);
router.post('/report', reportUser);

// Video call
router.post('/call/room', createRoom);
router.post('/call/token', generateToken);

export default router;
