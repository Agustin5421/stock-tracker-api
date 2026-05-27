package aseca.acmn.austral.stock_tracker_api.api.user

import aseca.acmn.austral.stock_tracker_api.application.auth.AuthenticatedUser
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController {
    @GetMapping("/current")
    fun getCurrentUser(
        @AuthenticationPrincipal principal: AuthenticatedUser,
    ): ResponseEntity<UserResponse> = ResponseEntity.ok(UserResponse(principal.id.toString(), principal.email))
}
