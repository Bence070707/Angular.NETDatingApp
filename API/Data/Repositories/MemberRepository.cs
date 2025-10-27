using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members
            .Include(m => m.User)
            .Include(m => m.Photos)
            .SingleOrDefaultAsync(m => m.Id == id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();

        if (!string.IsNullOrEmpty(memberParams.Gender))
        {
            query = query.Where(m => m.Gender == memberParams.Gender);
        }

        if (!string.IsNullOrEmpty(memberParams.MemberId))
        {
            query = query.Where(m => m.Id != memberParams.MemberId);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today).AddYears(-memberParams.MaxAge - 1);
        var maxDob = DateOnly.FromDateTime(DateTime.Today).AddYears(-memberParams.MinAge);

        query = query.Where(m => m.DateOfBirth >= minDob && m.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(m => m.Created),
            _ => query.OrderByDescending(m => m.LastActive)
        };

        return await PaginationHelper
        .CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId)
    {
        return await context.Members.
            Where(m => m.Id == memberId).
            SelectMany(m => m.Photos).
            ToListAsync();
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}

