using EduVision.Domain.Enums;
using MediatR;

namespace EduVision.Application.Features.Authentication.Commands.Login;

public sealed record LoginCommand(string Email, string Password, UserRole Role)
    : IRequest<LoginResponse>;
