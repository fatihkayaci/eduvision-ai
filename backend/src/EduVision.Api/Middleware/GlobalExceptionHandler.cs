using EduVision.Domain.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace EduVision.Api.Middleware;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, title, errors) = exception switch
        {
            NotFoundException e        => (StatusCodes.Status404NotFound, e.Message, null),
            UnauthorizedException e    => (StatusCodes.Status401Unauthorized, e.Message, null),
            DomainValidationException e => (StatusCodes.Status422UnprocessableEntity, e.Message, null),
            ValidationException e      => (StatusCodes.Status400BadRequest, "Validation failed.",
                e.Errors
                    .GroupBy(f => f.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(f => f.ErrorMessage).ToArray())),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.", null)
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Unhandled exception.");

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title
        };

        if (errors is not null)
            problemDetails.Extensions["errors"] = errors;

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
