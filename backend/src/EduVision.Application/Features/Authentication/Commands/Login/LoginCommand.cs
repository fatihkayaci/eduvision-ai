using MediatR;

namespace EduVision.Application.Features.Authentication.Commands.Login;

public sealed record LoginCommand(string Email, string Password)
    : IRequest<LoginResponse>;
