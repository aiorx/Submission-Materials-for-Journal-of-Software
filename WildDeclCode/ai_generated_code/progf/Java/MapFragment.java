package com.example.helb_mobile1.main.map;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.helb_mobile1.main.AppViewModelFactory;
import com.example.helb_mobile1.R;
import com.example.helb_mobile1.main.IOnFragmentVisibleListener;
import com.example.helb_mobile1.managers.DatabaseManager;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.CancellationTokenSource;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.model.LatLng;


public class MapFragment extends Fragment implements OnMapReadyCallback, IOnFragmentVisibleListener {
    /*
    one of the 4 main fragments in MainActivity, handles the map tab's visual side as well as its views
     */

    private final LatLng INITIAL_CAMERA_LOCATION = new LatLng(DatabaseManager.CENTER_POINT_BOUNDARY_LAT,
            DatabaseManager.CENTER_POINT_BOUNDARY_LNG);
    private final float INITIAL_ZOOM_LEVEL = 15f;
    private GoogleMap myMap;
    private FusedLocationProviderClient fusedLocationProviderClient;
    private MapViewModel mapViewModel;
    private Button cameraRedirectButton;
    private ActivityResultLauncher<String> locationPermissionLauncher;
    private ActivityResultLauncher<Intent> cameraActivityLauncher;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        /*
        Sets up views and their listeners, ViewModel connection and sets up Google Map to be ready
         */
        View view = inflater.inflate(R.layout.fragment_map, container, false);

        AppViewModelFactory factory = new AppViewModelFactory(requireContext());
        mapViewModel = new ViewModelProvider(this, factory).get(MapViewModel.class);


        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(requireActivity());
        //needed for location stuff

        //https://developers.google.com/maps/documentation/android-sdk/map#maps_android_on_map_ready_callback-java
        SupportMapFragment mapFragment = (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map);
        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }


        cameraRedirectButton = view.findViewById(R.id.map_redirect_camera);
        cameraActivityLauncher = registerForActivityResult(
                /*
                logic for when the user is taken to the Camera screen
                gives out location if picture taken, to submit marker to DB
                Code suggested by ChatGPT, modified
                 */
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK ) {
                        CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
                        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                            fusedLocationProviderClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, cancellationTokenSource.getToken())
                                    .addOnSuccessListener(location -> {
                                        if (location != null) {

                                            double lat = location.getLatitude();
                                            double lng = location.getLongitude();
                                            //Toast.makeText(requireActivity(), "Lat:"+lat+" Lng:"+lng,Toast.LENGTH_SHORT).show();
                                            myMap.clear();
                                            mapViewModel.setPersonalMarker(lat,lng);
                                        }
                                    });
                        }
                    }
                }
        );

        cameraRedirectButton.setOnClickListener(new View.OnClickListener() {
            /*
            redirects the user to the camera screen once clicked on camera button
             */
            @Override
            public void onClick(View v) {
                //Code Supported via standard programming aids
                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                if (intent.resolveActivity(requireActivity().getPackageManager()) != null){
                    cameraActivityLauncher.launch(intent);
                }
            }
        });

        locationPermissionLauncher = registerForActivityResult(
                /*
                logic for when the user is asked for location permissions
                 */
                new ActivityResultContracts.RequestPermission(),
                isGranted -> {
                    if (isGranted) {
                        Toast.makeText(requireContext(), "Location permission granted", Toast.LENGTH_SHORT).show();
                        if (myMap != null){
                            myMap.setMyLocationEnabled(true); //sets up Google Maps' premade stuff to handle user location
                        }
                    } else {
                        Toast.makeText(requireContext(), "Location permission denied", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        checkLocationPermission();

        return view;
    }


    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        /*
        handles code for when the map is ready
         */
        myMap = googleMap;

        myMap.moveCamera(CameraUpdateFactory.newLatLngZoom(INITIAL_CAMERA_LOCATION, INITIAL_ZOOM_LEVEL));
        //initial camera position

        //code suggested by ChatGPT
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            myMap.setMyLocationEnabled(true); //sets up Google Maps' premade stuff to handle user location
        }
        observeViewModel(); //only triggers once map is ready, as this function handles stuff that requires the map to be ready
    }

    private void checkLocationPermission() {
        /*
        launches the activity to ask for permission for Fine Location
        Code Supported via standard programming aids
         */
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION);
        }
    }

    private void observeViewModel(){
        /*
        deals with data from ViewModel, handles displaying map markers and visibility of camera button
         */
        mapViewModel.getPersonalMarkerLiveData().observe(getViewLifecycleOwner(), marker -> {
            if (marker != null){
                /*
                if MarkerList is fetched, the personal Marker is always found first and triggers this code first
                the map is safe to clear and displays all markers correctly this way
                 */
                myMap.clear();
                myMap.addMarker(marker);
            }
        });
        mapViewModel.getMarkersLiveData().observe(getViewLifecycleOwner(), markerOptions -> {
            if (!markerOptions.isEmpty()){
                for (MarkerOptions marker : markerOptions){
                    //displays markers from markerList fetched once Results time
                    myMap.addMarker(marker);
                }
            }
        });


        mapViewModel.getNotifLiveData().observe(getViewLifecycleOwner(), notif ->{
            if (notif != null){
                Toast.makeText(requireActivity(), notif, Toast.LENGTH_SHORT).show();
            }
        });
        mapViewModel.getIsCameraVisible().observe(getViewLifecycleOwner(), isCameraVisible ->{
            if (isCameraVisible){
                cameraRedirectButton.setVisibility(View.VISIBLE);
            } else {
                cameraRedirectButton.setVisibility(View.INVISIBLE);
            }
        });



    }

    @Override
    public void onFragmentVisible() {
         /*
        implementing IOnFragmentVisibleListener lets the fragment trigger code each time the fragment
        is selected in the BottomNavigationMenu
         */
        checkLocationPermission();
        mapViewModel.checkTimeAndHandleResults();

    }
}