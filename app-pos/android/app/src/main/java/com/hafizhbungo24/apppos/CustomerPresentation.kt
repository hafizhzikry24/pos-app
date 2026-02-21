package com.hafizhbungo24.apppos

import android.app.Presentation
import android.content.Context
import android.os.Bundle
import android.view.Display
import android.view.LayoutInflater
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONArray
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class CustomerPresentation(context: Context, display: Display) : Presentation(context, display) {

    private lateinit var idleSection: LinearLayout
    private lateinit var cartSection: LinearLayout
    private lateinit var cartItemsContainer: LinearLayout
    private lateinit var totalPriceView: TextView
    private lateinit var itemCountBadge: TextView
    private lateinit var headerTime: TextView

    private val currencyFormat: NumberFormat by lazy {
        NumberFormat.getNumberInstance(Locale("id", "ID")).apply {
            maximumFractionDigits = 0
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.customer_display)

        idleSection         = findViewById(R.id.idle_section)
        cartSection         = findViewById(R.id.cart_section)
        cartItemsContainer  = findViewById(R.id.cart_items_container)
        totalPriceView      = findViewById(R.id.total_price)
        itemCountBadge      = findViewById(R.id.item_count_badge)
        headerTime          = findViewById(R.id.header_time)

        updateClock()
        showIdle()
    }

    // ── Public API ───────────────────────────────────────────────────────────────────────────

    fun updateCart(cartJson: String) {
        try {
            updateClock()
            val cartArray = JSONArray(cartJson)
            cartItemsContainer.removeAllViews()

            if (cartArray.length() == 0) {
                showIdle()
                totalPriceView.text = formatCurrency(0.0)
                return
            }

            showCart()

            var total = 0.0
            var totalItems = 0

            for (i in 0 until cartArray.length()) {
                val itemObj  = cartArray.getJSONObject(i)
                val item     = itemObj.getJSONObject("item")
                val quantity = itemObj.getInt("quantity")
                val price    = item.getDouble("price")
                val name     = item.getString("name")

                val lineTotal = price * quantity
                total        += lineTotal
                totalItems   += quantity

                addItemRow(name, quantity, price, lineTotal)
            }

            totalPriceView.text   = formatCurrency(total)
            itemCountBadge.text   = "$totalItems item${if (totalItems != 1) "s" else ""}"

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    // ── Private helpers ──────────────────────────────────────────────────────────────────────

    private fun showIdle() {
        idleSection.visibility = View.VISIBLE
        cartSection.visibility  = View.GONE
    }

    private fun showCart() {
        idleSection.visibility = View.GONE
        cartSection.visibility  = View.VISIBLE
    }

    private fun addItemRow(name: String, quantity: Int, unitPrice: Double, lineTotal: Double) {
        val inflater = LayoutInflater.from(context)
        val row = inflater.inflate(R.layout.cart_item_row, cartItemsContainer, false)

        row.findViewById<TextView>(R.id.item_qty_badge).text    = quantity.toString()
        row.findViewById<TextView>(R.id.item_name).text         = name
        row.findViewById<TextView>(R.id.item_unit_price).text   = "${formatCurrency(unitPrice)} / item"
        row.findViewById<TextView>(R.id.item_line_total).text   = formatCurrency(lineTotal)

        // Slide-in animation for premium feel
        val anim = AnimationUtils.loadAnimation(context, R.anim.slide_in_bottom)
        row.startAnimation(anim)

        cartItemsContainer.addView(row)
    }

    private fun formatCurrency(amount: Double): String {
        return "Rp ${currencyFormat.format(amount)}"
    }

    private fun updateClock() {
        val fmt = SimpleDateFormat("EEE, dd MMM  HH:mm", Locale("id", "ID"))
        headerTime.text = fmt.format(Date())
    }
}
