<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Your App</h1>
          </div>

          <!-- User Info & Actions -->
          <div class="flex items-center space-x-4">
            <div v-if="user" class="flex items-center space-x-4">
              <!-- User Avatar & Info -->
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <img
                    v-if="user.user_metadata?.avatar_url"
                    :src="user.user_metadata.avatar_url"
                    :alt="displayName"
                    class="h-8 w-8 rounded-full"
                  />
                  <div
                    v-else
                    class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center"
                  >
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(displayName) }}
                    </span>
                  </div>
                </div>
                <div class="hidden sm:block">
                  <p class="text-sm font-medium text-gray-900">
                    {{ displayName }}
                  </p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
              </div>

              <!-- Logout Button -->
              <button
                @click="handleLogout"
                :disabled="loading"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {{ loading ? "Signing out..." : "Sign out" }}
              </button>
            </div>

            <!-- Login Button (when not authenticated) -->
            <div v-else>
              <NuxtLink
                to="/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Section for Authenticated Users -->
      <div v-if="user" class="text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome back, {{ displayName }}!
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            You're successfully logged in to your account.
          </p>

          <!-- User Details Card -->
          <div class="mt-8 bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Account Information
            </h3>
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">User ID</dt>
                <dd class="mt-1 text-sm text-gray-900 font-mono">
                  {{ user.id }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Last Sign In</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(user.last_sign_in_at) }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">
                  Account Created
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(user.created_at) }}
                </dd>
              </div>
              <div v-if="user.app_metadata?.provider">
                <dt class="text-sm font-medium text-gray-500">
                  Sign-in Method
                </dt>
                <dd class="mt-1 text-sm text-gray-900 capitalize">
                  {{ user.app_metadata.provider }}
                </dd>
              </div>
              <div v-if="user.email_confirmed_at">
                <dt class="text-sm font-medium text-gray-500">
                  Email Verified
                </dt>
                <dd class="mt-1 text-sm text-green-600">
                  ✓ {{ formatDate(user.email_confirmed_at) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Welcome Section for Non-Authenticated Users -->
      <div v-else class="text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Your App
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Please sign in to access your account and personalized features.
          </p>
          <div class="mt-8">
            <NuxtLink
              to="/login"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Reactive data
const loading = ref(false);

// Computed properties
const displayName = computed(() => {
  if (!user.value) return "";

  // Try to get name from user metadata (OAuth providers)
  if (user.value.user_metadata?.full_name) {
    return user.value.user_metadata.full_name;
  }
  if (user.value.user_metadata?.name) {
    return user.value.user_metadata.name;
  }

  // Fallback to email username
  if (user.value.email) {
    return user.value.email.split("@")[0];
  }

  return "User";
});

// Utility functions
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Handle logout
const handleLogout = async () => {
  loading.value = true;

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Redirect to login page after logout
    await navigateTo("/login");
  } catch (error) {
    console.error("Error signing out:", error.message);
  } finally {
    loading.value = false;
  }
};

//Set page meta
useHead({
  title: user.value ? `Welcome ${displayName.value}` : "Welcome - Your App",
  meta: [{ name: "description", content: "Your personalized dashboard" }],
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
