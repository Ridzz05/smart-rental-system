<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VehicleController extends Controller
{
    public function index(): JsonResponse
    {
        $vehicles = Vehicle::with('category')->orderBy('id', 'desc')->get();
        return response()->json($vehicles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'license_plate' => 'required|string|unique:vehicles,license_plate',
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'required|in:Available,Rented,Maintenance',
            'image_url' => 'nullable|url',
        ]);

        $vehicle = Vehicle::create($validated);
        return response()->json($vehicle->load('category'), 210);
    }

    public function update(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'license_plate' => 'required|string|unique:vehicles,license_plate,' . $vehicle->id,
            'daily_rate' => 'required|numeric|min:0',
            'status' => 'required|in:Available,Rented,Maintenance',
            'image_url' => 'nullable|url',
        ]);

        $vehicle->update($validated);
        return response()->json($vehicle->load('category'));
    }

    public function destroy(Vehicle $vehicle): JsonResponse
    {
        $vehicle->delete();
        return response()->json(['message' => 'Vehicle deleted successfully']);
    }

    public function updateStatus(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Available,Rented,Maintenance',
        ]);

        $vehicle->update(['status' => $validated['status']]);
        return response()->json($vehicle);
    }
}
