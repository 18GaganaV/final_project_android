package com.namma.pustaka

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.namma.pustaka.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val sharedPref = getSharedPreferences("namma_pustaka", MODE_PRIVATE)
        
        // Auto login if session exists
        if (sharedPref.contains("student_id")) {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }

        binding.btnLogin.setOnClickListener {
            val name = binding.editName.text.toString()
            val id = binding.editId.text.toString()

            if (name.isNotEmpty() && id.isNotEmpty()) {
                with(sharedPref.edit()) {
                    putString("student_name", name)
                    putString("student_id", id)
                    apply()
                }
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            } else {
                Toast.makeText(this, "Please enter all details", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
