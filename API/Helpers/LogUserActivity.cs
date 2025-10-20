using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();
        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var memberId = resultContext.HttpContext.User.GetMemberId();
        var repo = resultContext.HttpContext.RequestServices.GetService<AppDbContext>();
        await repo!.Members.Where(x => x.Id == memberId)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.LastActive, DateTime.UtcNow));

    }
}
