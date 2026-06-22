using FluentValidation;

namespace EduVision.Application.Features.Authentication.Commands.Login;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(command => command.Password)
            .NotEmpty();

        RuleFor(command => command.Role)
            .IsInEnum()
            .Must(role => role != Domain.Enums.UserRole.None)
            .WithMessage("A valid role must be specified.");
    }
}
