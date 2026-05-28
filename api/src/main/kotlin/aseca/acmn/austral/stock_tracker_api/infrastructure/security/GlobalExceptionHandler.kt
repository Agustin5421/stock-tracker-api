package aseca.acmn.austral.stock_tracker_api.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarUnavailableException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(CompanyNotFoundException::class)
    fun handleNotFound(e: CompanyNotFoundException): ResponseEntity<Unit> = ResponseEntity.notFound().build()

    @ExceptionHandler(EdgarUnavailableException::class)
    fun handleEdgarUnavailable(e: EdgarUnavailableException): ResponseEntity<Unit> =
        ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build()

    @ExceptionHandler(EdgarException::class)
    fun handleEdgarError(e: EdgarException): ResponseEntity<Unit> = ResponseEntity.internalServerError().build()
}
