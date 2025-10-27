using System;
using API.Entities;
using API.Entities.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MessagesController(IUnitOfWork uow) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
    {
        var sender = await uow.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await uow.MemberRepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

        if (sender == null || recipient == null || sender.Id == recipient.Id) return BadRequest("Something went wrong.");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDTO.Content
        };

        uow.MessageRepository.AddMessage(message);
        if (await uow.Complete()) return Ok(message.ToDto());

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDTO>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();
        var messages = await uow.MessageRepository.GetMessagesForMemberAsync(messageParams);
        return Ok(messages);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDTO>>> GetMessageThread(string recipientId)
    {
        return Ok(await uow.MessageRepository.GetMessageThreadAsync(User.GetMemberId(), recipientId));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(string id)
    {
        var memberId = User.GetMemberId();
        var message = await uow.MessageRepository.GetMessageAsync(id);

        if (message is null) return BadRequest("Cannot delete message");

        if (message.SenderId != memberId && message.RecipientId != memberId)
            return BadRequest("You cannot delete this message");

        if (message.SenderId == memberId) message.SenderDeleted = true;
        if (message.RecipientId == memberId) message.RecipientDeleted = true;

        if (message is { SenderDeleted: true, RecipientDeleted: true })
            uow.MessageRepository.DeleteMessage(message);

        if (await uow.Complete()) return Ok();
        return BadRequest("Error occured while deleting the message");
    }
}
