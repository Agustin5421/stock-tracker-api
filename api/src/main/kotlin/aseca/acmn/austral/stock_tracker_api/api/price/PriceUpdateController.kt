package aseca.acmn.austral.stock_tracker_api.api.price

import aseca.acmn.austral.stock_tracker_api.application.price.TriggerPriceUpdateUseCase
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/admin/prices")
class PriceUpdateController(
    private val triggerPriceUpdateUseCase: TriggerPriceUpdateUseCase,
) {
    @PostMapping("/update")
    fun update(): ResponseEntity<Map<String, String>> {
        triggerPriceUpdateUseCase.trigger()
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(mapOf("status" to "triggered"))
    }
}
