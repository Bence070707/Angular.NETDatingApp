using System;
using API.Entities;
using API.Entities.DTOs;
using API.Helpers;

namespace API.Interfaces;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessageAsync(string messageId);
    Task<PaginatedResult<MessageDTO>> GetMessagesForMemberAsync(MessageParams messageParams);
    Task<IReadOnlyList<MessageDTO>> GetMessageThreadAsync(string currentMemberId, string recipientMemberId);
    void AddGroup(Group group);
    Task RemoveConnection(string connectionid);
    Task<Connection?> GetConnection(string connectionId);
    Task<Group?> GetMessageGroup(string groupName);
    Task<Group?> GetGroupForConnection(string connectionid);
}
