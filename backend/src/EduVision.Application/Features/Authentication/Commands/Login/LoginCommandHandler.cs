using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Authentication.Commands.Login;

public sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenService tokenService)
    : IRequestHandler<LoginCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Email or password is incorrect.");
        }

        var accessToken = tokenService.Create(user);

        return new LoginResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            accessToken.Value,
            accessToken.ExpiresAtUtc);
    }
}
