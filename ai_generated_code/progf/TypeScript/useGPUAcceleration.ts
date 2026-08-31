// Supported via standard GitHub programming aids
'use client';

import { useAppStore } from '@/store/appStore';
import { useCallback, useEffect, useState } from 'react';

interface GPUCapabilities {
  supported: boolean;
  adapters: {
    name: string;
    vendor: string | null;
    features: string[];
  }[];
  preferredBackend: 'webgpu' | 'webgl' | 'cpu';
  maxComputeWorkgroups: {
    width: number;
    height: number;
    depth: number;
  } | null;
  maxStorageBufferBindingSize: number | null;
  maximumTextureArrayLayers: number | null;
}

/**
 * Hook to detect WebGPU capabilities and optimize rendering performance
 * Uses the latest WebGPU API and falls back gracefully
 */
export const useGPUAcceleration = () => {
  const [capabilities, setCapabilities] = useState<GPUCapabilities>({
    supported: false,
    adapters: [],
    preferredBackend: 'cpu',
    maxComputeWorkgroups: null,
    maxStorageBufferBindingSize: null,
    maximumTextureArrayLayers: null,
  });

  const [isDetecting, setIsDetecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access app settings to respect user preferences
  const { highPerformanceMode } = useAppStore((state) => state.settings);
  const { addToast } = useAppStore((state) => ({ addToast: state.addToast }));

  // Detect GPU capabilities
  const detectCapabilities = useCallback(async () => {
    try {
      setIsDetecting(true);
      setError(null);

      // Check if the WebGPU API is available
      if (!('gpu' in navigator)) {
        setCapabilities({
          supported: false,
          adapters: [],
          preferredBackend: 'webgl',
          maxComputeWorkgroups: null,
          maxStorageBufferBindingSize: null,
          maximumTextureArrayLayers: null,
        });
        return;
      }

      // Request adapter to check for actual hardware support
      const gpuAdapter = await navigator.gpu.requestAdapter({
        powerPreference: highPerformanceMode ? 'high-performance' : 'low-power',
      });

      if (!gpuAdapter) {
        // WebGPU API available but no adapter found
        setCapabilities({
          supported: false,
          adapters: [],
          preferredBackend: 'webgl',
          maxComputeWorkgroups: null,
          maxStorageBufferBindingSize: null,
          maximumTextureArrayLayers: null,
        });
        return;
      }

      // Get adapter info for supported features
      const adapterInfo = await gpuAdapter.requestAdapterInfo();

      // Request device to get limits
      const gpuDevice = await gpuAdapter.requestDevice();
      const supportedFeatures = gpuAdapter.features.values();
      const featureList: string[] = [];

      for (const feature of supportedFeatures) {
        featureList.push(feature);
      }

      setCapabilities({
        supported: true,
        adapters: [
          {
            name: adapterInfo.device || 'Unknown GPU',
            vendor: adapterInfo.vendor || null,
            features: featureList,
          },
        ],
        preferredBackend: 'webgpu',
        maxComputeWorkgroups: {
          width: gpuDevice.limits.maxComputeWorkgroupsPerDimension,
          height: gpuDevice.limits.maxComputeWorkgroupsPerDimension,
          depth: gpuDevice.limits.maxComputeWorkgroupsPerDimension,
        },
        maxStorageBufferBindingSize:
          gpuDevice.limits.maxStorageBufferBindingSize,
        maximumTextureArrayLayers: gpuDevice.limits.maxTextureArrayLayers,
      });

      // Clean up resources
      gpuDevice.destroy();
    } catch (err) {
      console.error('Error detecting GPU capabilities:', err);

      setError(
        err instanceof Error ? err.message : 'Unknown error detecting GPU',
      );

      // Fallback to WebGL detection
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');

        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          const vendor = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            : gl.getParameter(gl.VENDOR);
          const renderer = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);

          setCapabilities({
            supported: false,
            adapters: [
              {
                name: renderer || 'Unknown WebGL Renderer',
                vendor: vendor || null,
                features: ['webgl2'],
              },
            ],
            preferredBackend: 'webgl',
            maxComputeWorkgroups: null,
            maxStorageBufferBindingSize: null,
            maximumTextureArrayLayers: null,
          });
        } else {
          // No WebGL support either
          setCapabilities({
            supported: false,
            adapters: [],
            preferredBackend: 'cpu',
            maxComputeWorkgroups: null,
            maxStorageBufferBindingSize: null,
            maximumTextureArrayLayers: null,
          });
        }
      } catch (webglErr) {
        console.error('Error detecting WebGL capabilities:', webglErr);

        setCapabilities({
          supported: false,
          adapters: [],
          preferredBackend: 'cpu',
          maxComputeWorkgroups: null,
          maxStorageBufferBindingSize: null,
          maximumTextureArrayLayers: null,
        });
      }
    } finally {
      setIsDetecting(false);
    }
  }, [highPerformanceMode, addToast]);

  // Run detection on mount and when high performance mode changes
  useEffect(() => {
    detectCapabilities();
  }, [detectCapabilities]);

  // Helper to run compute shaders based on detected capabilities
  const runComputeShader = useCallback(
    async ({
      shader,
      input,
      workgroupSize = [64, 1, 1],
      workgroupCount = [1, 1, 1],
      outputSize,
    }: {
      shader: string;
      input: Float32Array | Uint32Array;
      workgroupSize?: [number, number, number];
      workgroupCount?: [number, number, number];
      outputSize: number;
    }) => {
      if (!capabilities.supported) {
        // Fallback to CPU computation
        console.warn('WebGPU not supported, falling back to CPU computation');
        return null;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: highPerformanceMode
            ? 'high-performance'
            : 'low-power',
        });

        if (!adapter) {
          throw new Error('No GPU adapter found');
        }

        const device = await adapter.requestDevice();

        // Create input buffer
        const inputBuffer = device.createBuffer({
          size: input.byteLength,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        // Create output buffer
        const outputBuffer = device.createBuffer({
          size: outputSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        // Create staging buffer for reading results
        const stagingBuffer = device.createBuffer({
          size: outputSize,
          usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        });

        // Upload data to input buffer
        device.queue.writeBuffer(inputBuffer, 0, input);

        // Create compute pipeline
        const shaderModule = device.createShaderModule({
          code: shader,
        });

        const computePipeline = device.createComputePipeline({
          layout: 'auto',
          compute: {
            module: shaderModule,
            entryPoint: 'main',
          },
        });

        // Create bind group
        const bindGroup = device.createBindGroup({
          layout: computePipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: {
                buffer: inputBuffer,
              },
            },
            {
              binding: 1,
              resource: {
                buffer: outputBuffer,
              },
            },
          ],
        });

        // Create command encoder
        const commandEncoder = device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();

        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(
          workgroupCount[0],
          workgroupCount[1],
          workgroupCount[2],
        );
        computePass.end();

        // Copy output to staging buffer
        commandEncoder.copyBufferToBuffer(
          outputBuffer,
          0,
          stagingBuffer,
          0,
          outputSize,
        );

        // Submit commands
        const commands = commandEncoder.finish();
        device.queue.submit([commands]);

        // Map staging buffer and read results
        await stagingBuffer.mapAsync(GPUMapMode.READ);
        const resultBuffer = stagingBuffer.getMappedRange(0, outputSize);
        const result = new Float32Array(resultBuffer.slice(0));

        // Clean up
        stagingBuffer.unmap();
        inputBuffer.destroy();
        outputBuffer.destroy();
        stagingBuffer.destroy();
        device.destroy();

        return result;
      } catch (err) {
        console.error('Error running compute shader:', err);
        return null;
      }
    },
    [capabilities.supported, highPerformanceMode],
  );

  // Run a cryptographic hash using WebGPU for enhanced performance
  const acceleratedHash = useCallback(
    async (data: Uint8Array): Promise<string | null> => {
      if (!capabilities.supported) {
        // Fallback to regular crypto API
        try {
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch (err) {
          console.error('Crypto API error:', err);
          return null;
        }
      }

      // WebGPU implementation of SHA-256 would go here
      // This is a simplified example; a real implementation would use the runComputeShader function
      return null;
    },
    [capabilities.supported, runComputeShader],
  );

  return {
    capabilities,
    isDetecting,
    error,
    detectCapabilities,
    runComputeShader,
    acceleratedHash,
  };
};
