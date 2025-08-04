import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  integrationTypes,
  SYNC_DIRECTIONS,
  SYNC_FREQUENCIES,
  AUTH_TYPES,
  type I_Integration,
  type T_AuthType,
  type T_SyncDirection,
  type T_SyncFrequency,
} from "@/lib/db";
import { addIntegration } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  name: string;
  type: string;
  system: string;
  endpoint: string;
  authType: T_AuthType;
  syncDirection: T_SyncDirection;
  syncFrequency: T_SyncFrequency;
};

export function ConfigurationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const selectedType = watch("type");
  const selectedIntegrationType = integrationTypes.find(
    (t) => t.id === selectedType
  );

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const newIntegration: I_Integration = {
        id: `int-${Date.now()}`,
        name: data.name,
        type: data.type,
        system: data.system,
        status: "active",
        lastSync: new Date().toISOString(),
        syncFrequency: data.syncFrequency,
        syncDirection: data.syncDirection,
        recordsCount: 0,
        errorCount: 0,
        configuration: {
          endpoint: data.endpoint,
          authType: data.authType,
          dataMapping: {},
        },
      };

      const result = await addIntegration(newIntegration);
      setSubmitMessage(result);
    } catch (error) {
      setSubmitMessage("Failed to create integration: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-14">
      <h2 className="text-lg font-semibold">New Integration Configuration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        {/* Integration Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Integration Name *</Label>
          <Input
            id="name"
            {...register("name", { required: "Integration name is required" })}
            placeholder="Enter integration name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Integration Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Integration Type *</Label>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Please select an integration type" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  {integrationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-600">{errors.type.message}</p>
          )}
          {selectedIntegrationType && (
            <p className="text-sm text-gray-600">
              {selectedIntegrationType.description}
            </p>
          )}
        </div>

        {/* System */}
        {selectedIntegrationType && (
          <div className="space-y-2">
            <Label htmlFor="system">System *</Label>
            <Controller
              name="system"
              control={control}
              rules={{ required: "Please select a system" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIntegrationType.supportedSystems.map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.system && (
              <p className="text-sm text-red-600">{errors.system.message}</p>
            )}
          </div>
        )}

        {/* Endpoint */}
        <div className="space-y-2">
          <Label htmlFor="endpoint">API Endpoint *</Label>
          <Input
            id="endpoint"
            {...register("endpoint", {
              required: "API endpoint is required",
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Please enter a valid URL",
              },
            })}
            placeholder="https://api.example.com"
          />
          {errors.endpoint && (
            <p className="text-sm text-red-600">{errors.endpoint.message}</p>
          )}
        </div>

        {/* Auth Type */}
        <div className="space-y-2">
          <Label htmlFor="authType">Authentication Type *</Label>
          <Controller
            name="authType"
            control={control}
            rules={{ required: "Please select an authentication type" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  {AUTH_TYPES.map((authType) => (
                    <SelectItem key={authType} value={authType}>
                      {authType === "oauth" ? "OAuth 2.0" : "API Key"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.authType && (
            <p className="text-sm text-red-600">{errors.authType.message}</p>
          )}
        </div>

        {/* Sync Direction */}
        <div className="space-y-2">
          <Label htmlFor="syncDirection">Sync Direction *</Label>
          <Controller
            name="syncDirection"
            control={control}
            rules={{ required: "Please select a sync direction" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sync direction" />
                </SelectTrigger>
                <SelectContent>
                  {SYNC_DIRECTIONS.map((direction) => (
                    <SelectItem key={direction} value={direction}>
                      {direction.charAt(0).toUpperCase() +
                        direction.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.syncDirection && (
            <p className="text-sm text-red-600">
              {errors.syncDirection.message}
            </p>
          )}
        </div>

        {/* Sync Frequency */}
        <div className="space-y-2">
          <Label htmlFor="syncFrequency">Sync Frequency *</Label>
          <Controller
            name="syncFrequency"
            control={control}
            rules={{ required: "Please select a sync frequency" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sync frequency" />
                </SelectTrigger>
                <SelectContent>
                  {SYNC_FREQUENCIES.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency.charAt(0).toUpperCase() +
                        frequency.slice(1).replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.syncFrequency && (
            <p className="text-sm text-red-600">
              {errors.syncFrequency.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col space-y-4">
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Creating Integration..." : "Create Integration"}
          </Button>

          {submitMessage && (
            <p
              className={`text-sm ${
                submitMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submitMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
