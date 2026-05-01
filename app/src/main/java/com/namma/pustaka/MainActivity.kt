package com.namma.pustaka

import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.namma.pustaka.databinding.ActivityMainBinding
import com.namma.pustaka.fragments.HomeFragment
import com.namma.pustaka.fragments.StatsFragment
import com.namma.pustaka.fragments.LeaderboardFragment

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Default fragment
        loadFragment(HomeFragment())

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> loadFragment(HomeFragment())
                R.id.nav_stats -> loadFragment(StatsFragment())
                R.id.nav_leaderboard -> loadFragment(LeaderboardFragment())
            }
            true
        }

        binding.imgProfile.setOnClickListener {
            showProfileDialog()
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.container, fragment)
            .commit()
    }

    private fun showProfileDialog() {
        val sharedPref = getSharedPreferences("namma_pustaka", MODE_PRIVATE)
        val name = sharedPref.getString("student_name", "Unknown")
        val id = sharedPref.getString("student_id", "Unknown")

        AlertDialog.Builder(this)
            .setTitle("Student Profile")
            .setMessage("Name: $name\nID: $id")
            .setPositiveButton("OK", null)
            .show()
    }
}
