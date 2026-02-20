package com.hafizhbungo24.apppos

import android.app.Presentation
import android.content.Context
import android.os.Bundle
import android.view.Display
import android.view.LayoutInflater
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONArray
import org.json.JSONObject
import com.hafizhbungo24.apppos.R

class CustomerPresentation(context: Context, display: Display) : Presentation(context, display) {
    private lateinit var cartItemsContainer: LinearLayout
    private lateinit var totalPriceView: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.customer_display)
        
        cartItemsContainer = findViewById(R.id.cart_items_container)
        totalPriceView = findViewById(R.id.total_price)
    }

    fun updateCart(cartJson: String) {
        try {
            val cartArray = JSONArray(cartJson)
            cartItemsContainer.removeAllViews()
            
            var total = 0.0

            for (i in 0 until cartArray.length()) {
                val itemObj = cartArray.getJSONObject(i)
                val item = itemObj.getJSONObject("item")
                val quantity = itemObj.getInt("quantity")
                val price = item.getDouble("price")
                val name = item.getString("name")
                
                val itemTotal = price * quantity
                total += itemTotal

                addItemToLayout(name, quantity, itemTotal)
            }

            totalPriceView.text = "Rp ${String.format("%,.0f", total)}"
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun addItemToLayout(name: String, quantity: Int, total: Double) {
        val inflater = LayoutInflater.from(context)
        val itemView = inflater.inflate(android.R.layout.simple_list_item_2, cartItemsContainer, false)
        
        val text1 = itemView.findViewById<TextView>(android.R.id.text1)
        val text2 = itemView.findViewById<TextView>(android.R.id.text2)
        
        text1.text = name
        text1.textSize = 20f
        text2.text = "$quantity x Rp ${String.format("%,.0f", total / quantity)} = Rp ${String.format("%,.0f", total)}"
        text2.textSize = 16f
        
        cartItemsContainer.addView(itemView)
    }
}
