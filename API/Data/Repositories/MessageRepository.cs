using System;
using API.Entities;
using API.Entities.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessageAsync(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDTO>> GetMessagesForMemberAsync(MessageParams messageParams)
    {
        var query = context.Messages
            .OrderByDescending(x => x.MessageSent)
            .AsQueryable();

        query = messageParams.Container switch
        {
            "Outbox" => query.Where(m => m.SenderId == messageParams.MemberId && m.SenderDeleted == false),
            _ => query.Where(m => m.RecipientId == messageParams.MemberId && m.RecipientDeleted == false)
        };

        var messageQuery = query.Select(MessageExtensions.ToDtoExpression());

        return await PaginationHelper.CreateAsync(messageQuery, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDTO>> GetMessageThreadAsync(string currentMemberId, string recipientMemberId)
    {
        await context.Messages
            .Where(x => x.RecipientId == currentMemberId && x.SenderId == recipientMemberId && x.DateRead == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));

        return await context.Messages
                            .Where(x => (x.RecipientId == currentMemberId && x.SenderId == recipientMemberId && x.RecipientDeleted == false) ||
                                        (x.SenderId == currentMemberId && x.RecipientId == recipientMemberId && x.SenderDeleted == false))
                                        .OrderBy(x => x.MessageSent)
                                        .Select(MessageExtensions.ToDtoExpression())
                            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
