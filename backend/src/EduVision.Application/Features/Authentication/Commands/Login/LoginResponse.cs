namespace EduVision.Application.Features.Authentication.Commands.Login;

public sealed record LoginResponse(
    Guid UserId,
    string FirstName,
    string LastName,
    string AccessToken,
    DateTimeOffset ExpiresAtUtc);
