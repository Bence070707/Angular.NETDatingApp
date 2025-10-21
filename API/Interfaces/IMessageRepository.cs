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
    Task<bool> SaveAllAsync();
}
