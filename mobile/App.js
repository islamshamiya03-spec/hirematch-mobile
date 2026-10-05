import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  ScrollView,
  StatusBar,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'https://hirematch-backend-f6xb.onrender.com';

const BLUE = '#FF4F70';

const jobs = [
  {
    id: 'demo-1',
    title: 'Frontend Developer',
    company: 'TechNova Solutions',
    location: 'Kolkata',
    type: 'Full-time',
    salary: '₹5,00,000 - ₹7,00,000',
    skills: ['HTML', 'CSS', 'React'],
    posted: '2 days ago',
    score: 92,
  },
  {
    id: 'demo-2',
    title: 'UI/UX Designer',
    company: 'Creative Labs',
    location: 'Remote',
    type: 'Remote',
    salary: '₹4,00,000 - ₹6,00,000',
    skills: ['Figma', 'UI Design', 'UX'],
    posted: '1 day ago',
    score: 87,
  },
  {
    id: 'demo-3',
    title: 'React Developer',
    company: 'NextGen Web',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹7,00,000 - ₹10,00,000',
    skills: ['React', 'JavaScript', 'Tailwind'],
    posted: '3 days ago',
    score: 81,
  },
  {
    id: 'demo-4',
    title: 'Data Scientist Intern',
    company: 'DataWorks',
    location: 'Remote',
    type: 'Internship',
    salary: '₹2,50,000 - ₹3,50,000',
    skills: ['Python', 'SQL', 'Machine Learning'],
    posted: '5 days ago',
    score: 78,
  },
  {
    id: 'demo-5',
    title: 'Backend Developer',
    company: 'CloudStack',
    location: 'Hyderabad',
    type: 'Full-time',
    salary: '₹6,50,000 - ₹9,00,000',
    skills: ['Node.js', 'Express', 'MongoDB'],
    posted: '4 days ago',
    score: 74,
  },
];

const applications = [
  [
    'Frontend Developer',
    'TechNova Solutions',
    'Kolkata',
    'Applied',
    '2 days ago',
  ],
  [
    'React Developer',
    'NextGen Web',
    'Bangalore',
    'Shortlisted',
    '5 days ago',
  ],
  [
    'UI/UX Designer',
    'Creative Labs',
    'Remote',
    'Interview',
    '1 week ago',
  ],
  [
    'Backend Developer',
    'CloudStack',
    'Hyderabad',
    'Rejected',
    '2 weeks ago',
  ],
];

const tabs = [
  ['Home', 'home-outline'],
  ['Search', 'search-outline'],
  ['Matched', 'star-outline'],
  ['Applications', 'document-text-outline'],
  ['Profile', 'person-outline'],
];

const recruiterTabs = [
  {
    label: 'Home',
    icon: 'home-outline',
    page: 'Job Recruiter',
  },
  {
    label: 'Likes',
    icon: 'heart-outline',
    page: 'Recruiter Matches',
  },
  {
    label: 'Feed',
    icon: 'heart',
    page: 'Feed',
    center: true,
  },
  {
    label: 'Jobs',
    icon: 'briefcase-outline',
    page: 'Recruiter Jobs',
  },
  {
    label: 'Profile',
    icon: 'person-outline',
    page: 'Recruiter Profile',
  },
];

const candidateProfiles = [
  {
    id: 'candidate-1',
    name: 'Aarav Sharma',
    headline: 'Senior Frontend Engineer',
    location: 'Bengaluru, India',
    experience: '6 years experience',
    initials: 'AS',
    skills: ['React', 'TypeScript', 'Next.js', 'Accessibility'],
    summary:
      'Builds polished, accessible products and has led frontend architecture for teams of up to six engineers.',
    education: 'B.Tech, Computer Science · NIT Trichy',
    highlight:
      'Reduced page load time by 42% across a high traffic marketplace.',
  },
  {
    id: 'candidate-2',
    name: 'Maya Das',
    headline: 'Product Designer',
    location: 'Remote · Kolkata, India',
    experience: '4 years experience',
    initials: 'MD',
    skills: [
      'Figma',
      'UX Research',
      'Prototyping',
      'Design Systems',
    ],
    summary:
      'Turns complex workflows into clear interfaces. Enjoys partnering with engineering from early concepts through launch.',
    education: 'B.Des, Interaction Design · NID Ahmedabad',
    highlight:
      'Created a design system now used across 3 product teams.',
  },
  {
    id: 'candidate-3',
    name: 'Rohan Sen',
    headline: 'Backend Engineer',
    location: 'Hyderabad, India',
    experience: '5 years experience',
    initials: 'RS',
    skills: ['Node.js', 'PostgreSQL', 'AWS', 'API Design'],
    summary:
      'Experienced in reliable services, thoughtful API design, and improving developer experience on growing platforms.',
    education: 'MCA · University of Hyderabad',
    highlight:
      'Designed services supporting 1M+ monthly transactions.',
  },
  {
    id: 'candidate-4',
    name: 'Nisha Patel',
    headline: 'Data Scientist',
    location: 'Pune, India',
    experience: '3 years experience',
    initials: 'NP',
    skills: ['Python', 'SQL', 'Machine Learning', 'NLP'],
    summary:
      'Applies practical machine learning to customer and operations problems, with a focus on measurable outcomes.',
    education:
      'M.Sc, Data Science · Savitribai Phule Pune University',
    highlight:
      'Improved lead scoring precision by 18% in production.',
  },
  {
    id: 'candidate-5',
    name: 'Kabir Mehta',
    headline: 'Mobile Developer',
    location: 'Mumbai, India',
    experience: '4 years experience',
    initials: 'KM',
    skills: ['React Native', 'Expo', 'JavaScript', 'iOS'],
    summary:
      'Ships reliable mobile experiences from prototype to app store, with a strong eye for performance and interaction detail.',
    education:
      'B.E., Information Technology · Mumbai University',
    highlight:
      'Launched a cross-platform app with 100K+ downloads.',
  },
];

function SwipeDeck({ profiles, onDecision, onEmptyAction }) {
  const [index, setIndex] = useState(0);
  const position = useRef(
    new Animated.ValueXY()
  ).current;

  const current = profiles[index];
  const next = profiles[index + 1];

  const rotate = position.x.interpolate({
    inputRange: [-240, 0, 240],
    outputRange: ['-16deg', '0deg', '16deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [15, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-100, -15],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const decide = useCallback(
    (direction, velocity = 0) => {
      if (!profiles[index]) return;

      Animated.spring(position, {
        toValue: {
          x: direction === 'like' ? 480 : -480,
          y: 0,
        },
        velocity: {
          x: velocity,
          y: 0,
        },
        useNativeDriver: true,
        tension: 72,
        friction: 12,
        overshootClamping: true,
      }).start(() => {
        onDecision(
          profiles[index],
          direction
        );

        setIndex(value => value + 1);

        position.setValue({
          x: 0,
          y: 0,
        });
      });
    },
    [
      index,
      onDecision,
      position,
      profiles,
    ]
  );

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (
          _,
          gesture
        ) =>
          Math.abs(gesture.dx) > 12 &&
          Math.abs(gesture.dx) >
            Math.abs(gesture.dy),

        onPanResponderMove:
          Animated.event(
            [
              null,
              {
                dx: position.x,
                dy: position.y,
              },
            ],
            {
              useNativeDriver: false,
            }
          ),

        onPanResponderRelease: (
          _,
          gesture
        ) =>
          gesture.dx > 105 ||
          gesture.vx > 0.65
            ? decide(
                'like',
                gesture.vx
              )
            : gesture.dx <
                  -105 ||
                gesture.vx <
                  -0.65
              ? decide(
                  'pass',
                  gesture.vx
                )
              : Animated.spring(
                  position,
                  {
                    toValue: {
                      x: 0,
                      y: 0,
                    },
                    useNativeDriver: true,
                    tension: 75,
                    friction: 10,
                  }
                ).start(),

        onPanResponderTerminate:
          () =>
            Animated.spring(
              position,
              {
                toValue: {
                  x: 0,
                  y: 0,
                },
                useNativeDriver: true,
                tension: 75,
                friction: 10,
              }
            ).start(),
      }),
    [decide, position]
  );

  if (!current) {
    return (
      <View
        style={styles.feedEmpty}
      >
        <Ionicons
          name="sparkles"
          size={42}
          color="#7057E8"
        />

        <Text
          style={
            styles.feedEmptyTitle
          }
        >
          You're all caught up
        </Text>

        <Text style={styles.muted}>
          You've reviewed every sample
          profile in this feed.
        </Text>

        <Button
          onPress={onEmptyAction}
        >
          Start over
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.feedWrap}>
      <View style={styles.feedIntro}>
        <View
          style={
            styles.feedIntroHeading
          }
        >
          <View>
            <Text
              style={styles.eyebrow}
            >
              TALENT FEED
            </Text>

            <Text
              style={styles.feedTitle}
            >
              Find your next great hire
            </Text>
          </View>

          <Text
            style={styles.feedCount}
          >
            {index + 1}/{profiles.length}
          </Text>
        </View>

        <Text style={styles.muted}>
          Swipe right to like or left
          to pass.
        </Text>
      </View>

      <View
        style={styles.deckArea}
      >
        {next && (
          <View
            style={[
              styles.candidateCard,
              styles.candidateCardBack,
            ]}
          >
            <View
              style={
                styles.cardBackBlock
              }
            />
          </View>
        )}

        <Animated.View
          {...responder.panHandlers}
          style={[
            styles.candidateCard,
            {
              transform: [
                {
                  translateX:
                    position.x,
                },
                {
                  translateY:
                    position.y,
                },
                {
                  rotate,
                },
              ],
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.swipeStamp,
              styles.likeStamp,
              {
                opacity:
                  likeOpacity,
              },
            ]}
          >
            <Text
              style={[
                styles.swipeStampText,
                styles.likeStampText,
              ]}
            >
              LIKE
            </Text>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.swipeStamp,
              styles.passStamp,
              {
                opacity:
                  passOpacity,
              },
            ]}
          >
            <Text
              style={[
                styles.swipeStampText,
                styles.passStampText,
              ]}
            >
              PASS
            </Text>
          </Animated.View>

          <ScrollView
            style={
              styles.candidateScroll
            }
            showsVerticalScrollIndicator
            contentContainerStyle={
              styles.candidateContent
            }
            nestedScrollEnabled
          >
            <View
              style={
                styles.candidateHero
              }
            >
              <View
                style={
                  styles.candidateAvatar
                }
              >
                <Text
                  style={
                    styles.candidateInitials
                  }
                >
                  {current.initials}
                </Text>
              </View>

              <Text
                style={
                  styles.candidateName
                }
              >
                {current.name}
              </Text>

              <Text
                style={
                  styles.candidateHeadline
                }
              >
                {current.headline}
              </Text>

              <Text
                style={
                  styles.candidateMeta
                }
              >
                {current.location} ·{' '}
                {current.experience}
              </Text>
            </View>

            <View
              style={
                styles.candidateDetails
              }
            >
              <Text
                style={
                  styles.candidateSectionTitle
                }
              >
                About
              </Text>

              <Text
                style={
                  styles.candidateCopy
                }
              >
                {current.summary}
              </Text>

              <Text
                style={
                  styles.candidateSectionTitle
                }
              >
                Experience highlight
              </Text>

              <Text
                style={
                  styles.candidateCopy
                }
              >
                {current.highlight}
              </Text>

              <Text
                style={
                  styles.candidateSectionTitle
                }
              >
                Education
              </Text>

              <Text
                style={
                  styles.candidateCopy
                }
              >
                {current.education}
              </Text>

              <Text
                style={
                  styles.candidateSectionTitle
                }
              >
                Top skills
              </Text>

              <View
                style={
                  styles.chipRow
                }
              >
                {current.skills.map(
                  skill => (
                    <View
                      key={skill}
                      style={
                        styles.candidateSkill
                      }
                    >
                      <Text
                        style={
                          styles.candidateSkillText
                        }
                      >
                        {skill}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>

      <View
        style={
          styles.swipeActions
        }
      >
        <Pressable
          accessibilityLabel="Pass on candidate"
          onPress={() =>
            decide('pass')
          }
          style={[
            styles.swipeAction,
            styles.passAction,
          ]}
        >
          <Ionicons
            name="close"
            size={29}
            color="#FF4F70"
          />
        </Pressable>

        <Text
          style={styles.swipeHint}
        >
          Pass
        </Text>

        <Text
          style={styles.swipeHint}
        >
          Like
        </Text>

        <Pressable
          accessibilityLabel="Like candidate"
          onPress={() =>
            decide('like')
          }
          style={[
            styles.swipeAction,
            styles.likeAction,
          ]}
        >
          <Ionicons
            name="heart"
            size={23}
            color="#FFF8F5"
          />
        </Pressable>
      </View>

      <Text
        style={styles.swipeFootnote}
      >
        A right swipe saves a candidate
        to Matches.
      </Text>
    </View>
  );
}

function Button({
  children,
  onPress,
  secondary = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        secondary &&
          styles.secondaryButton,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary &&
            styles.secondaryButtonText,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function Chip({
  children,
  selected,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected &&
          styles.chipSelected,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selected &&
            styles.chipTextSelected,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function Header({
  onBack,
  onLogout,
  title,
  logo = false,
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          onPress={onBack}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={BLUE}
          />
        </Pressable>
      ) : (
        <View
          style={{ width: 24 }}
        />
      )}

      {logo ? (
        <Text
          style={styles.brand}
        >
          <Text
            style={{ color: BLUE }}
          >
            Hire
          </Text>
          <Text>Match</Text>
        </Text>
      ) : (
        <Text
          style={styles.brand}
        >
          {title || (
            <>
              <Text
                style={{ color: BLUE }}
              >
                Hire
              </Text>
              Match
            </>
          )}
        </Text>
      )}

      {onLogout ? (
        <Pressable
          onPress={onLogout}
        >
          <Text
            style={styles.link}
          >
            Log out
          </Text>
        </Pressable>
      ) : (
        <View
          style={{ width: 24 }}
        />
      )}
    </View>
  );
}

function Section({
  title,
  action,
  children,
}) {
  return (
    <View style={styles.card}>
      <View
        style={
          styles.sectionHeading
        }
      >
        <Text
          style={styles.sectionTitle}
        >
          {title}
        </Text>

        {action}
      </View>

      {children}
    </View>
  );
}

function JobCard({
  job,
  onApply,
  matched = false,
}) {
  return (
    <View style={styles.card}>
      <View
        style={styles.rowBetween}
      >
        <Text
          style={styles.jobTitle}
        >
          {job.title}
        </Text>

        {matched &&
          job.score > 0 && (
            <Text
              style={styles.match}
            >
              {job.score}% match
            </Text>
          )}
      </View>

      <Text style={styles.muted}>
        {job.company} ·{' '}
        {job.location}
      </Text>

      <Text
        style={styles.salary}
      >
        {job.salary}
      </Text>

      {job.description ? (
        <Text
          style={[
            styles.smallMuted,
            { marginTop: 7 },
          ]}
        >
          {job.description}
        </Text>
      ) : null}

      {job.experience ? (
        <Text
          style={[
            styles.smallMuted,
            { marginTop: 6 },
          ]}
        >
          Experience: {job.experience}
        </Text>
      ) : null}

      <View
        style={styles.chipRow}
      >
        {job.skills.map(
          skill => (
            <Chip key={skill}>
              {skill}
            </Chip>
          )
        )}
      </View>

      <View
        style={styles.rowBetween}
      >
        <Text
          style={styles.smallMuted}
        >
          {job.type} ·{' '}
          {job.posted}
        </Text>

        <Pressable
          onPress={onApply}
          style={styles.apply}
        >
          <Text
            style={styles.applyText}
          >
            Apply now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  editable = true,
}) {
  return (
    <View
      style={{
        marginBottom: 14,
      }}
    >
      <Text
        style={styles.label}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={
          onChangeText
        }
        editable={editable}
        placeholder={
          placeholder ||
          `Enter ${label.toLowerCase()}`
        }
        placeholderTextColor="#697386"
        multiline={multiline}
        style={[
          styles.input,
          !editable &&
            styles.inputDisabled,
          multiline && {
            height: 100,
            textAlignVertical:
              'top',
          },
        ]}
      />
    </View>
  );
}

function AppScreen() {
  const insets =
    useSafeAreaInsets();

  const [page, setPage] =
    useState('Auth');

  const [authMode, setAuthMode] =
    useState('Log in');

  const [role, setRole] =
    useState('Job Seeker');

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [authErrors, setAuthErrors] =
    useState({});

  const [
    accessToken,
    setAccessToken,
  ] = useState(null);

  const [
    backendJobs,
    setBackendJobs,
  ] = useState([]);

  const [
    recruiterJobs,
    setRecruiterJobs,
  ] = useState([]);

  const [
    recruiterJobsLoading,
    setRecruiterJobsLoading,
  ] = useState(false);

  const [
    editingJobId,
    setEditingJobId,
  ] = useState(null);

  const [jobForm, setJobForm] =
    useState({
      title: '',
      description: '',
      employment_type: 'Full-time',
      required_skills: '',
      company_name: '',
      location: '',
      salary: '',
      experience_required: '',
    });

  const [
    likedCandidates,
    setLikedCandidates,
  ] = useState([]);

  const [feedReset, setFeedReset] =
    useState(0);

  const [query, setQuery] =
    useState('');

  const [filter, setFilter] =
    useState('All');

  const [status, setStatus] =
    useState('All');

  const [notice, setNotice] =
    useState('');

  const [editing, setEditing] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: '',
      email: '',
      phone: '',
      location: '',
      role: '',
      about: '',
    });

  const [resume, setResume] =
    useState({
      name: '',
      headline: '',
      email: '',
      summary: '',
    });

  /*
   * REAL JOBS FROM BACKEND
   */
  useEffect(() => {
    if (
      !accessToken ||
      role !== 'Job Seeker'
    ) {
      return;
    }

    const fetchActiveJobs =
      async () => {
        try {
          const response =
            await fetch(
              `${API_BASE_URL}/jobs/active`,
              {
                method: 'GET',
                headers: {
                  Accept:
                    'application/json',
                  Authorization:
                    `Bearer ${accessToken}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            console.error(
              'Failed to fetch jobs:',
              data.detail
            );
            return;
          }

          const formattedJobs =
            data.jobs.map(
              job => ({
                id: job.id,
                title:
                  job.title,
                company:
                  job.company_name,
                location:
                  job.location,
                type:
                  job.employment_type,
                salary:
                  job.salary ||
                  'Salary not specified',
                skills:
                  job.required_skills
                    ? job.required_skills
                        .split(',')
                        .map(skill =>
                          skill.trim()
                        )
                        .filter(
                          Boolean
                        )
                    : [],
                posted:
                  job.created_at
                    ? new Date(
                        job.created_at
                      ).toLocaleDateString()
                    : 'Recently',
                score: 0,
                description:
                  job.description,
                experience:
                  job.experience_required ||
                  '',
                active:
                  job.active,
              })
            );

          setBackendJobs(
            formattedJobs
          );
        } catch (error) {
          console.error(
            'Jobs API connection error:',
            error
          );
        }
      };

    fetchActiveJobs();
  }, [
    accessToken,
    role,
  ]);

  const changeJobForm = (key, value) =>
    setJobForm(prev => ({
      ...prev,
      [key]: value,
    }));

  const resetJobForm = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      description: '',
      employment_type: 'Full-time',
      required_skills: '',
      company_name: '',
      location: '',
      salary: '',
      experience_required: '',
    });
  };

  const fetchRecruiterJobs = useCallback(
    async () => {
      if (!accessToken || role !== 'Recruiter') {
        return;
      }

      setRecruiterJobsLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/jobs/`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              'Failed to load recruiter jobs.'
          );
        }

        const jobsFromApi = Array.isArray(data)
          ? data
          : data.jobs || [];

        setRecruiterJobs(jobsFromApi);
      } catch (error) {
        console.error(
          'Recruiter jobs API error:',
          error
        );
        setNotice(
          error.message ||
            'Cannot load recruiter jobs.'
        );
        setTimeout(
          () => setNotice(''),
          2400
        );
      } finally {
        setRecruiterJobsLoading(false);
      }
    },
    [accessToken, role]
  );

  useEffect(() => {
    fetchRecruiterJobs();
  }, [fetchRecruiterJobs]);

  const saveRecruiterJob = async () => {
    if (!accessToken || role !== 'Recruiter') {
      return;
    }

    const requiredFields = [
      ['title', 'Job title'],
      ['description', 'Description'],
      ['required_skills', 'Required skills'],
      ['company_name', 'Company name'],
      ['location', 'Location'],
      ['salary', 'Salary'],
      ['experience_required', 'Experience required'],
    ];

    const missing = requiredFields.find(
      ([key]) => !jobForm[key].trim()
    );

    if (missing) {
      setNotice(`Please enter ${missing[1]}.`);
      setTimeout(
        () => setNotice(''),
        2400
      );
      return;
    }

    try {
      const isEditing = Boolean(editingJobId);
      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/jobs/${editingJobId}`
          : `${API_BASE_URL}/jobs/`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: jobForm.title.trim(),
            description: jobForm.description.trim(),
            employment_type: jobForm.employment_type,
            required_skills: jobForm.required_skills.trim(),
            company_name: jobForm.company_name.trim(),
            location: jobForm.location.trim(),
            salary: jobForm.salary.trim(),
            experience_required:
              jobForm.experience_required.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            (isEditing
              ? 'Failed to update job.'
              : 'Failed to create job.')
        );
      }

      await fetchRecruiterJobs();

      setPage('Recruiter Jobs');
      resetJobForm();
      setNotice(
        isEditing
          ? 'Job updated successfully.'
          : 'Job posted successfully.'
      );
      setTimeout(
        () => setNotice(''),
        2400
      );
    } catch (error) {
      console.error(
        'Save recruiter job error:',
        error
      );
      setNotice(
        error.message ||
          'Could not save the job.'
      );
      setTimeout(
        () => setNotice(''),
        2400
      );
    }
  };

  const startEditingRecruiterJob = job => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      employment_type:
        job.employment_type || 'Full-time',
      required_skills: job.required_skills || '',
      company_name: job.company_name || '',
      location: job.location || '',
      salary: job.salary || '',
      experience_required:
        job.experience_required || '',
    });
    setPage('Post Job');
  };

  const deleteRecruiterJob = job => {
    Alert.alert(
      'Delete job',
      `Delete “${job.title}”? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/jobs/${job.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.detail ||
                    'Failed to delete job.'
                );
              }

              await fetchRecruiterJobs();
              setNotice('Job deleted successfully.');
              setTimeout(
                () => setNotice(''),
                2400
              );
            } catch (error) {
              console.error(
                'Delete recruiter job error:',
                error
              );
              setNotice(
                error.message ||
                  'Could not delete the job.'
              );
              setTimeout(
                () => setNotice(''),
                2400
              );
            }
          },
        },
      ]
    );
  };

  /*
   * Backend jobs are preferred.
   * Demo jobs are fallback only if
   * backend returns no jobs.
   */
  const availableJobs =
    backendJobs.length > 0
      ? backendJobs
      : jobs;

  const changeProfile = (
    key,
    value
  ) =>
    setProfile(prev => ({
      ...prev,
      [key]: value,
    }));

  const changeResume = (
    key,
    value
  ) =>
    setResume(prev => ({
      ...prev,
      [key]: value,
    }));

  const results = useMemo(
    () =>
      availableJobs.filter(
        job =>
          (filter === 'All' ||
            job.type === filter) &&
          `${job.title} ${job.company} ${job.location} ${job.skills.join(
            ' '
          )}`
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      ),
    [
      availableJobs,
      query,
      filter,
    ]
  );

  const apply = async job => {
    if (!accessToken) {
      setNotice('Please log in first.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/applications/${job.id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setNotice(
          data.detail || 'Failed to apply for this job.'
        );
        return;
      }

      setNotice(`Application sent for ${job.title}.`);

      setTimeout(
        () => setNotice(''),
        2400
      );
    } catch (error) {
      console.error('Application error:', error);
      setNotice('Cannot connect to the backend.');
    }
  };

  /*
   * REAL BACKEND LOGIN
   */
  const handleAuth =
    async () => {
      const email =
        username.trim();

      const nextErrors = {};

      if (
        !email ||
        !email.includes('@')
      ) {
        nextErrors.username =
          'Enter a valid email address.';
      }

      if (!password) {
        nextErrors.password =
          'Enter your password.';
      }

      if (
        Object.keys(
          nextErrors
        ).length
      ) {
        setAuthErrors(
          nextErrors
        );
        return;
      }

      try {
        if (
          authMode ===
          'Log in'
        ) {
          const response =
            await fetch(
              `${API_BASE_URL}/auth/login`,
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                  Accept:
                    'application/json',
                },
                body: JSON.stringify(
                  {
                    email,
                    password,
                  }
                ),
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            setAuthErrors({
              username:
                data.detail ||
                'Login failed.',
            });

            return;
          }

          const backendRole =
            data.user.role;

          setAccessToken(
            data.access_token
          );

          setRole(
            backendRole ===
              'RECRUITER'
              ? 'Recruiter'
              : 'Job Seeker'
          );

          setProfile(prev => ({
            ...prev,
            name:
              data.user.name,
            email:
              data.user.email,
            role:
              backendRole,
          }));

          setAuthErrors({});

          setPage(
            backendRole ===
              'RECRUITER'
              ? 'Job Recruiter'
              : 'Job Seeker'
          );

          console.log(
            'Login successful'
          );
        } else {
          setAuthErrors({
            username:
              'Signup connection will be added next.',
          });
        }
      } catch (error) {
        console.error(
          'Login error:',
          error
        );

        setAuthErrors({
          username:
            'Cannot connect to the backend.',
        });
      }
    };

  const content = () => {
    if (page === 'Auth') {
      return (
        <View
          style={
            styles.authWrap
          }
        >
          <View
            style={
              styles.authCard
            }
          >
            <Text
              style={
                styles.welcomeBrand
              }
            >
              HireMatch
            </Text>

            <Text
              style={
                styles.authSubtitle
              }
            >
              AI-Powered Job Matching
              and Job Search Platform
            </Text>

            <View
              style={
                styles.authModeRow
              }
            >
              {[
                'Log in',
                'Sign up',
              ].map(mode => (
                <Pressable
                  key={mode}
                  onPress={() => {
                    setAuthMode(
                      mode
                    );
                    setAuthErrors(
                      {}
                    );
                  }}
                  style={[
                    styles.authMode,
                    authMode ===
                      mode &&
                      styles.authModeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.authModeText,
                      authMode ===
                        mode &&
                        styles.authModeTextActive,
                    ]}
                  >
                    {mode}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text
              style={
                styles.authTitle
              }
            >
              {authMode ===
              'Log in'
                ? 'Welcome back'
                : 'Create your account'}
            </Text>

            <Text
              style={styles.muted}
            >
              Continue as a job
              seeker or recruiter.
            </Text>

            <Text
              style={styles.label}
            >
              Email
            </Text>

            <TextInput
              value={username}
              onChangeText={
                value => {
                  setUsername(
                    value
                  );

                  setAuthErrors(
                    current => ({
                      ...current,
                      username:
                        '',
                    })
                  );
                }
              }
              placeholder="Enter your email"
              placeholderTextColor="#697386"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={128}
              keyboardType="email-address"
              textContentType="username"
              style={[
                styles.input,
                authErrors.username &&
                  styles.inputError,
              ]}
            />

            {authErrors.username ? (
              <Text
                style={
                  styles.errorText
                }
              >
                {authErrors.username}
              </Text>
            ) : null}

            <Text
              style={[
                styles.label,
                { marginTop: 12 },
              ]}
            >
              Password
            </Text>

            <TextInput
              value={
                password
              }
              onChangeText={
                value => {
                  setPassword(
                    value
                  );

                  setAuthErrors(
                    current => ({
                      ...current,
                      password:
                        '',
                      confirmPassword:
                        '',
                    })
                  );
                }
              }
              placeholder="Enter your password"
              placeholderTextColor="#697386"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={128}
              textContentType="password"
              style={[
                styles.input,
                authErrors.password &&
                  styles.inputError,
              ]}
            />

            {authErrors.password ? (
              <Text
                style={
                  styles.errorText
                }
              >
                {authErrors.password}
              </Text>
            ) : null}

            {authMode ===
            'Sign up' ? (
              <>
                <Text
                  style={[
                    styles.label,
                    { marginTop: 12 },
                  ]}
                >
                  Confirm password
                </Text>

                <TextInput
                  value={
                    confirmPassword
                  }
                  onChangeText={
                    value => {
                      setConfirmPassword(
                        value
                      );

                      setAuthErrors(
                        current => ({
                          ...current,
                          confirmPassword:
                            '',
                        })
                      );
                    }
                  }
                  placeholder="Re-enter your password"
                  placeholderTextColor="#697386"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={128}
                  textContentType="newPassword"
                  style={[
                    styles.input,
                    authErrors.confirmPassword &&
                      styles.inputError,
                  ]}
                />

                {authErrors.confirmPassword ? (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    {
                      authErrors.confirmPassword
                    }
                  </Text>
                ) : null}
              </>
            ) : null}

            <Text
              style={[
                styles.label,
                { marginTop: 14 },
              ]}
            >
              I am a
            </Text>

            <View
              style={
                styles.roleRow
              }
            >
              {[
                'Recruiter',
                'Job Seeker',
              ].map(item => (
                <Pressable
                  key={item}
                  onPress={() =>
                    setRole(item)
                  }
                  style={[
                    styles.roleChoice,
                    role === item &&
                      styles.roleChoiceActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleChoiceText,
                      role === item &&
                        styles.roleChoiceTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Button
              onPress={
                handleAuth
              }
            >
              {authMode ===
              'Log in'
                ? 'Log in'
                : 'Create account'}
            </Button>

            <Text
              style={
                styles.authFootnote
              }
            >
              By continuing, you agree to HireMatch
              terms and Privacy Policy. Demo only; no
              account is created.
            </Text>
          </View>
        </View>
      );
    }

    if (page === 'Feed') {
      return (
        <SwipeDeck
          key={feedReset}
          profiles={
            candidateProfiles
          }
          onDecision={(
            candidate,
            direction
          ) => {
            if (
              direction ===
              'like'
            ) {
              setLikedCandidates(
                current =>
                  current.some(
                    item =>
                      item.id ===
                      candidate.id
                  )
                    ? current
                    : [
                        ...current,
                        candidate,
                      ]
              );

              setNotice(
                `You liked ${candidate.name}.`
              );
            } else {
              setNotice(
                `Passed on ${candidate.name}.`
              );
            }

            setTimeout(
              () =>
                setNotice(''),
              1800
            );
          }}
          onEmptyAction={() =>
            setFeedReset(
              value =>
                value + 1
            )
          }
        />
      );
    }

    if (
      page ===
      'Recruiter Matches'
    ) {
      return (
        <>
          <Text
            style={
              styles.pageTitle
            }
          >
            Candidates you liked
          </Text>

          <Text
            style={
              styles.muted
            }
          >
            Profiles you liked in the
            talent feed appear here.
          </Text>

          {likedCandidates.length ? (
            likedCandidates.map(
              candidate => (
                <View
                  key={
                    candidate.id
                  }
                  style={
                    styles.card
                  }
                >
                  <View
                    style={
                      styles.rowBetween
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.jobTitle
                        }
                      >
                        {
                          candidate.name
                        }
                      </Text>

                      <Text
                        style={
                          styles.muted
                        }
                      >
                        {
                          candidate.headline
                        }
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.match
                      }
                    >
                      Liked
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.smallMuted
                    }
                  >
                    {
                      candidate.location
                    } ·{' '}
                    {
                      candidate.experience
                    }
                  </Text>

                  <View
                    style={
                      styles.chipRow
                    }
                  >
                    {candidate.skills
                      .slice(0, 3)
                      .map(
                        skill => (
                          <View
                            key={
                              skill
                            }
                            style={
                              styles.candidateSkill
                            }
                          >
                            <Text
                              style={
                                styles.candidateSkillText
                              }
                            >
                              {
                                skill
                              }
                            </Text>
                          </View>
                        )
                      )}
                  </View>
                </View>
              )
            )
          ) : (
            <View
              style={
                styles.card
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                No matches yet
              </Text>

              <Text
                style={[
                  styles.muted,
                  { marginTop: 5 },
                ]}
              >
                Like a profile in Feed to
                save it here.
              </Text>

              <Button
                onPress={() =>
                  setPage('Feed')
                }
              >
                Explore candidates
              </Button>
            </View>
          )}
        </>
      );
    }

    if (page === 'Post Job') {
      return (
        <>
          <Text style={styles.pageTitle}>
            {editingJobId ? 'Edit job' : 'Post a job'}
          </Text>

          <Text style={styles.muted}>
            {editingJobId
              ? 'Update the job details below.'
              : 'Create a new opening for job seekers.'}
          </Text>

          <Section title="Job details">
            <Field
              label="Job Title"
              value={jobForm.title}
              onChangeText={v => changeJobForm('title', v)}
              placeholder="Example: Python Backend Developer"
            />

            <Field
              label="Description"
              value={jobForm.description}
              onChangeText={v => changeJobForm('description', v)}
              placeholder="Describe the role and responsibilities"
              multiline
            />

            <Text style={styles.label}>Employment Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterRow}
            >
              {['Full-time', 'Part-time', 'Internship', 'Remote'].map(
                type => (
                  <Chip
                    key={type}
                    selected={jobForm.employment_type === type}
                    onPress={() =>
                      changeJobForm('employment_type', type)
                    }
                  >
                    {type}
                  </Chip>
                )
              )}
            </ScrollView>

            <Field
              label="Required Skills"
              value={jobForm.required_skills}
              onChangeText={v =>
                changeJobForm('required_skills', v)
              }
              placeholder="Python, FastAPI, SQL"
            />

            <Field
              label="Company Name"
              value={jobForm.company_name}
              onChangeText={v =>
                changeJobForm('company_name', v)
              }
              placeholder="Your company name"
            />

            <Field
              label="Location"
              value={jobForm.location}
              onChangeText={v => changeJobForm('location', v)}
              placeholder="Kolkata, West Bengal"
            />

            <Field
              label="Salary"
              value={jobForm.salary}
              onChangeText={v => changeJobForm('salary', v)}
              placeholder="5-7 LPA"
            />

            <Field
              label="Experience Required"
              value={jobForm.experience_required}
              onChangeText={v =>
                changeJobForm('experience_required', v)
              }
              placeholder="Fresher / 2 years"
            />
          </Section>

          <Button onPress={saveRecruiterJob}>
            {editingJobId ? 'Update Job' : 'Post Job'}
          </Button>

          <Button
            secondary
            onPress={() => {
              resetJobForm();
              setPage('Recruiter Jobs');
            }}
          >
            Cancel
          </Button>
        </>
      );
    }

    if (
      page === 'Recruiter Jobs'
    ) {
      return (
        <>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.pageTitle}>
                Your job postings
              </Text>

              <Text style={styles.muted}>
                Manage your real backend job openings.
              </Text>
            </View>

            <Pressable
              onPress={() => {
                resetJobForm();
                setPage('Post Job');
              }}
              style={styles.smallPrimaryButton}
            >
              <Ionicons
                name="add"
                size={17}
                color="#FFF8F5"
              />
              <Text style={styles.smallPrimaryButtonText}>
                Post
              </Text>
            </Pressable>
          </View>

          {recruiterJobsLoading ? (
            <View style={styles.card}>
              <Text style={styles.muted}>
                Loading your jobs...
              </Text>
            </View>
          ) : recruiterJobs.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                No jobs posted yet
              </Text>
              <Text style={[styles.muted, { marginTop: 5 }]}>
                Your first job will appear here after you post it.
              </Text>
              <Button
                onPress={() => {
                  resetJobForm();
                  setPage('Post Job');
                }}
              >
                Post your first job
              </Button>
            </View>
          ) : (
            recruiterJobs.map(job => (
              <View
                key={job.id}
                style={styles.card}
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.jobTitle}>
                    {job.title}
                  </Text>

                  <Text
                    style={
                      job.active
                        ? styles.activeBadge
                        : styles.inactiveBadge
                    }
                  >
                    {job.active ? 'Active' : 'Inactive'}
                  </Text>
                </View>

                <Text style={styles.muted}>
                  {job.company_name || 'Company not specified'}
                </Text>

                <Text style={[styles.smallMuted, { marginTop: 8 }]}>
                  {job.location || 'Location not specified'}
                  {job.salary ? ` · ${job.salary}` : ''}
                </Text>

                <Text style={[styles.smallMuted, { marginTop: 4 }]}>
                  {job.employment_type || 'Employment type not specified'}
                  {job.experience_required
                    ? ` · ${job.experience_required}`
                    : ''}
                </Text>

                {job.required_skills ? (
                  <Text style={[styles.smallMuted, { marginTop: 7 }]}>
                    Skills: {job.required_skills}
                  </Text>
                ) : null}

                <View
                  style={[
                    styles.rowBetween,
                    { marginTop: 14 },
                  ]}
                >
                  <Pressable
                    onPress={() =>
                      startEditingRecruiterJob(job)
                    }
                  >
                    <Text style={styles.link}>
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      deleteRecruiterJob(job)
                    }
                  >
                    <Text style={styles.dangerLink}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </>
      );
    }

    if (
      page ===
      'Recruiter Profile'
    ) {
      return (
        <>
          <Text
            style={
              styles.pageTitle
            }
          >
            Recruiter profile
          </Text>

          <Text
            style={
              styles.muted
            }
          >
            Your recruiter account is
            ready to explore candidates.
          </Text>

          <View
            style={
              styles.profileHero
            }
          >
            <View
              style={
                styles.avatar
              }
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                HM
              </Text>
            </View>

            <Text
              style={
                styles.sectionTitle
              }
            >
              HireMatch Recruiting
            </Text>

            <Text
              style={
                styles.muted
              }
            >
              Recruiter account · Demo
              workspace
            </Text>
          </View>

          <Button
            secondary
            onPress={() => {
              setPage('Auth');
              setPassword('');
              setConfirmPassword(
                ''
              );
              setAuthErrors({});
              setAccessToken(null);
              setBackendJobs([]);
            }}
          >
            Log out
          </Button>
        </>
      );
    }

    if (
      page === 'Job Recruiter'
    ) {
      const activeJobs = recruiterJobs.filter(
        job => job.active
      );

      return (
        <>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>
              RECRUITER WORKSPACE
            </Text>

            <Text style={styles.heroTitle}>
              Find the right people.
            </Text>

            <Text style={styles.muted}>
              Manage your openings and
              connect with qualified candidates.
            </Text>

            <Button
              onPress={() => {
                resetJobForm();
                setPage('Post Job');
              }}
              style={{
                alignSelf: 'flex-start',
                marginTop: 18,
              }}
            >
              <Ionicons
                name="add"
                size={18}
                color="#FFF8F5"
              />{' '}
              Post a job
            </Button>
          </View>

          <View style={styles.statsRow}>
            {[
              ['Active jobs', String(activeJobs.length)],
              ['Applicants', '0'],
              ['Shortlisted', '0'],
            ].map(([label, value]) => (
              <View
                key={label}
                style={styles.statCard}
              >
                <Text style={styles.statValue}>
                  {value}
                </Text>

                <Text style={styles.statLabel}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <Section
            title="Your job postings"
            action={
              <Pressable
                onPress={() =>
                  setPage('Recruiter Jobs')
                }
              >
                <Text style={styles.link}>
                  View all
                </Text>
              </Pressable>
            }
          >
            {recruiterJobsLoading ? (
              <Text style={styles.muted}>
                Loading your jobs...
              </Text>
            ) : recruiterJobs.length === 0 ? (
              <View>
                <Text style={styles.muted}>
                  No job postings yet.
                </Text>
                <Button
                  secondary
                  onPress={() => {
                    resetJobForm();
                    setPage('Post Job');
                  }}
                  style={{ marginTop: 12 }}
                >
                  Post your first job
                </Button>
              </View>
            ) : (
              recruiterJobs
                .slice(0, 3)
                .map(job => (
                  <View
                    key={job.id}
                    style={styles.recruiterJob}
                  >
                    <View style={styles.rowBetween}>
                      <Text style={styles.jobTitle}>
                        {job.title}
                      </Text>

                      <Text
                        style={
                          job.active
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        {job.active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>

                    <Text style={styles.muted}>
                      {job.company_name || 'Company not specified'}
                    </Text>

                    <View
                      style={[
                        styles.rowBetween,
                        { marginTop: 12 },
                      ]}
                    >
                      <Text style={styles.smallMuted}>
                        {job.location || 'Location not specified'}
                      </Text>

                      <Pressable
                        onPress={() =>
                          startEditingRecruiterJob(job)
                        }
                      >
                        <Text style={styles.link}>
                          Edit job
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))
            )}
          </Section>

          <Section
            title="Recent matches"
            action={
              <Pressable
                onPress={() =>
                  setPage('Feed')
                }
              >
                <Text style={styles.link}>
                  View all
                </Text>
              </Pressable>
            }
          >
            {[
              [
                'Aarav Sharma',
                'Frontend Developer',
                'Strong React match',
              ],
              [
                'Maya Das',
                'Product Designer',
                'Portfolio attached',
              ],
              [
                'Rohan Sen',
                'Backend Engineer',
                '5 years experience',
              ],
            ].map(([name, job, detail]) => (
              <View
                key={name}
                style={styles.applicant}
              >
                <View style={styles.smallAvatar}>
                  <Text style={styles.avatarText}>
                    {name[0]}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.applicantName}>
                    {name}
                  </Text>

                  <Text style={styles.smallMuted}>
                    {job} · {detail}
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setNotice(
                      `Opening ${name}'s profile.`
                    )
                  }
                >
                  <Text style={styles.link}>
                    View
                  </Text>
                </Pressable>
              </View>
            ))}
          </Section>
        </>
      );
    }

    if (
      page === 'Home' ||
      page === 'Job Seeker'
    ) {
      return (
        <>
          <View
            style={styles.hero}
          >
            <Text
              style={
                styles.eyebrow
              }
            >
              YOUR NEXT OPPORTUNITY
            </Text>

            <Text
              style={
                styles.heroTitle
              }
            >
              Find a job that fits you.
            </Text>

            <Text
              style={
                styles.muted
              }
            >
              Discover opportunities matched
              to your skills and career goals.
            </Text>

            <Button
              onPress={() =>
                setPage('Search')
              }
              style={{
                alignSelf:
                  'flex-start',
                marginTop: 18,
              }}
            >
              Explore jobs
            </Button>
          </View>

          <Section title="Your profile">
            <Text
              style={styles.body}
            >
              Complete your profile to get better
              job matches.
            </Text>

            <View
              style={styles.progress}
            >
              <View
                style={
                  styles.progressFill
                }
              />
            </View>

            <Text
              style={
                styles.smallMuted
              }
            >
              75% complete
            </Text>

            <Button
              secondary
              onPress={() =>
                setPage('Profile')
              }
              style={{
                marginTop: 14,
              }}
            >
              Complete profile
            </Button>
          </Section>

          <View
            style={
              styles.rowBetween
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Recommended jobs
            </Text>

            <Pressable
              onPress={() =>
                setPage('Search')
              }
            >
              <Text
                style={styles.link}
              >
                View all
              </Text>
            </Pressable>
          </View>

          {/* ALL BACKEND JOBS */}
          {availableJobs.map(
            job => (
              <JobCard
                key={
                  job.id ||
                  job.title
                }
                job={job}
                matched={
                  job.score > 0
                }
                onApply={() => apply(job)}
              />
            )
          )}
        </>
      );
    }

    if (
      page === 'Search' ||
      page === 'Matched'
    ) {
      return (
        <>
          <Text
            style={
              styles.pageTitle
            }
          >
            {page === 'Search'
              ? 'Find your next job'
              : 'Jobs matched for you'}
          </Text>

          <Text
            style={
              styles.muted
            }
          >
            {page === 'Search'
              ? 'Search roles, companies, and skills.'
              : 'Based on your profile, skills, and preferences.'}
          </Text>

          <TextInput
            value={query}
            onChangeText={
              setQuery
            }
            placeholder="Job title, company, or skill"
            placeholderTextColor="#697386"
            style={
              styles.searchInput
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={
              styles.filterRow
            }
          >
            {[
              'All',
              'Full-time',
              'Part-time',
              'Internship',
              'Remote',
            ].map(x => (
              <Chip
                key={x}
                selected={
                  filter ===
                  x
                }
                onPress={() =>
                  setFilter(
                    x
                  )
                }
              >
                {x}
              </Chip>
            ))}
          </ScrollView>

          {(page ===
          'Matched'
            ? results.filter(
                job =>
                  job.score >=
                  78
              )
            : results
          ).map(job => (
            <JobCard
              key={
                job.id ||
                job.title
              }
              job={job}
              matched={
                page ===
                'Matched'
              }
              onApply={() => apply(job)}
            />
          ))}

          {results.length ===
            0 && (
            <Text
              style={
                styles.empty
              }
            >
              No jobs found. Try a
              different search.
            </Text>
          )}
        </>
      );
    }

    if (
      page ===
      'Applications'
    ) {
      return (
        <>
          <Text
            style={
              styles.pageTitle
            }
          >
            My Applications
          </Text>

          <Text
            style={
              styles.muted
            }
          >
            Track the progress of
            your job applications.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={
              styles.filterRow
            }
          >
            {[
              'All',
              'Applied',
              'Shortlisted',
              'Interview',
              'Rejected',
            ].map(x => (
              <Chip
                key={x}
                selected={
                  status ===
                  x
                }
                onPress={() =>
                  setStatus(
                    x
                  )
                }
              >
                {x}
              </Chip>
            ))}
          </ScrollView>

          {applications
            .filter(
              a =>
                status ===
                  'All' ||
                status === a[3]
            )
            .map(a => (
              <View
                key={a[0]}
                style={
                  styles.card
                }
              >
                <Text
                  style={
                    styles.jobTitle
                  }
                >
                  {a[0]}
                </Text>

                <Text
                  style={
                    styles.muted
                  }
                >
                  {a[1]} · {a[2]}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        '#FFDFE6',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        a[3] ===
                        'Rejected'
                          ? '#FF4F70'
                          : a[3] ===
                              'Interview'
                            ? '#7057E8'
                            : a[3] ===
                                'Shortlisted'
                              ? '#159B72'
                              : BLUE,
                      fontWeight:
                        '700',
                    }}
                  >
                    {a[3]}
                  </Text>
                </View>

                <Text
                  style={
                    styles.smallMuted
                  }
                >
                  Applied {a[4]}
                </Text>
              </View>
            ))}
        </>
      );
    }

    if (page === 'Profile') {
      return (
        <>
          <View
            style={
              styles.profileHero
            }
          >
            <View
              style={
                styles.avatar
              }
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                {profile.name
                  ? profile.name[0].toUpperCase()
                  : 'JS'}
              </Text>
            </View>

            <Text
              style={
                styles.pageTitle
              }
            >
              Job Seeker Profile
            </Text>

            <Text
              style={
                styles.muted
              }
            >
              Complete your profile to improve
              your job matches.
            </Text>

            <Text
              style={
                styles.progressLabel
              }
            >
              Profile 75% complete
            </Text>

            <View
              style={
                styles.progress
              }
            >
              <View
                style={
                  styles.progressFill
                }
              />
            </View>
          </View>

          <Section
            title="Personal Information"
            action={
              <Pressable
                onPress={() =>
                  setEditing(
                    !editing
                  )
                }
              >
                <Text
                  style={
                    styles.link
                  }
                >
                  {editing
                    ? 'Done'
                    : 'Edit'}
                </Text>
              </Pressable>
            }
          >
            {[
              ['name', 'Full Name'],
              [
                'role',
                'Professional Headline',
              ],
              ['email', 'Email'],
              [
                'phone',
                'Phone Number',
              ],
              [
                'location',
                'Location',
              ],
            ].map(
              ([
                key,
                label,
              ]) => (
                <Field
                  key={key}
                  label={label}
                  value={
                    profile[key]
                  }
                  onChangeText={v =>
                    changeProfile(
                      key,
                      v
                    )
                  }
                  editable={
                    editing
                  }
                  placeholder={
                    label ===
                    'Professional Headline'
                      ? 'Example: Frontend Developer'
                      : undefined
                  }
                />
              )
            )}
          </Section>

          <Section title="Skills">
            <View
              style={
                styles.chipRow
              }
            >
              {[
                'HTML',
                'CSS',
                'React',
                'DSA',
              ].map(x => (
                <Chip
                  key={x}
                >
                  {x}
                </Chip>
              ))}
            </View>
          </Section>

          <Section title="Languages">
            <View
              style={
                styles.chipRow
              }
            >
              {[
                'English',
                'Bengali',
                'Hindi',
              ].map(x => (
                <Chip
                  key={x}
                >
                  {x}
                </Chip>
              ))}
            </View>
          </Section>

          <Section title="About Me">
            <Field
              label="Introduction"
              value={
                profile.about
              }
              onChangeText={v =>
                changeProfile(
                  'about',
                  v
                )
              }
              editable={
                editing
              }
              placeholder="Write a short introduction about yourself"
              multiline
            />
          </Section>

          <Section title="Resume">
            <Text
              style={styles.body}
            >
              Create a resume with your profile details
              and experience.
            </Text>

            <Button
              onPress={() =>
                setPage(
                  'Resume'
                )
              }
            >
              Open Resume Builder
            </Button>
          </Section>

          <Button
            onPress={() => {
              setNotice(
                'Profile saved successfully.'
              );

              setTimeout(
                () =>
                  setNotice(''),
                2400
              );
            }}
          >
            Save Profile
          </Button>
        </>
      );
    }

    if (page === 'Resume') {
      return (
        <>
          <Text
            style={
              styles.pageTitle
            }
          >
            Resume Builder
          </Text>

          <Text
            style={
              styles.muted
            }
          >
            Build a resume tailored
            to your next opportunity.
          </Text>

          <Section title="Personal Information">
            <Field
              label="Full Name"
              value={
                resume.name
              }
              onChangeText={v =>
                setResume(
                  prev => ({
                    ...prev,
                    name: v,
                  })
                )
              }
            />

            <Field
              label="Professional Headline"
              value={
                resume.headline
              }
              onChangeText={v =>
                setResume(
                  prev => ({
                    ...prev,
                    headline: v,
                  })
                )
              }
              placeholder="Example: Frontend Developer"
            />

            <Field
              label="Email"
              value={
                resume.email
              }
              onChangeText={v =>
                setResume(
                  prev => ({
                    ...prev,
                    email: v,
                  })
                )
              }
            />
          </Section>

          <Section title="Professional Summary">
            <Field
              label="Summary"
              value={
                resume.summary
              }
              onChangeText={v =>
                setResume(
                  prev => ({
                    ...prev,
                    summary: v,
                  })
                )
              }
              placeholder="Write a short professional summary"
              multiline
            />
          </Section>

          <Section title="Skills">
            <Text
              style={styles.body}
            >
              HTML · CSS · React · DSA
            </Text>
          </Section>

          <Button
            onPress={() => {
              setNotice(
                'Resume saved successfully.'
              );

              setTimeout(
                () =>
                  setNotice(''),
                2400
              );
            }}
          >
            Save Resume
          </Button>
        </>
      );
    }

    return null;
  };

  const isRecruiter =
    role === 'Recruiter' &&
    page !== 'Auth';

  const showTabs =
    isRecruiter ||
    [
      'Job Seeker',
      'Home',
      'Search',
      'Matched',
      'Applications',
      'Profile',
    ].includes(page);

  const activeRecruiterPage =
    page === 'Job Recruiter'
      ? 'Job Recruiter'
      : page;

  return (
    <SafeAreaView
      edges={[
        'top',
        'left',
        'right',
      ]}
      style={styles.safe}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F2F3F7"
      />

      {page !== 'Auth' && (
        <Header
          title={
            page === 'Job Seeker'
              ? 'Job Seeker'
              : [
                  'Job Recruiter',
                  'Feed',
                  'Recruiter Matches',
                  'Recruiter Jobs',
                  'Recruiter Profile',
                ].includes(page)
                ? 'Recruiter'
                : undefined
          }
          logo={isRecruiter}
          onBack={
            page === 'Resume'
              ? () =>
                  setPage(
                    'Profile'
                  )
              : page === 'Post Job'
                ? () => {
                    resetJobForm();
                    setPage('Recruiter Jobs');
                  }
                : undefined
          }
          onLogout={() => {
            setPage('Auth');
            setPassword('');
            setConfirmPassword(
              ''
            );
            setAuthErrors({});
            setAccessToken(null);
            setBackendJobs([]);
            setRecruiterJobs([]);
            resetJobForm();
          }}
        />
      )}

      {page === 'Feed' ? (
        <View
          style={
            styles.feedPage
          }
        >
          {content()}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                showTabs
                  ? 104 +
                    insets.bottom
                  : 28,
            },
            page === 'Auth' &&
              styles.authContent,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {content()}
        </ScrollView>
      )}

      {notice ? (
        <View
          style={[
            styles.toast,
            {
              bottom:
                77 +
                insets.bottom,
            },
          ]}
        >
          <Text
            style={
              styles.toastText
            }
          >
            {notice}
          </Text>
        </View>
      ) : null}

      {showTabs &&
        (isRecruiter ? (
          <View
            style={[
              styles.tabBar,
              {
                height:
                  65 +
                  insets.bottom,
                paddingBottom:
                  Math.max(
                    insets.bottom,
                    4
                  ),
              },
            ]}
          >
            {recruiterTabs.map(
              item => (
                <Pressable
                  key={
                    item.page
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    item.label
                  }
                  onPress={() =>
                    setPage(
                      item.page
                    )
                  }
                  style={
                    styles.tab
                  }
                >
                  <View
                    style={[
                      styles.recruiterTabIcon,
                      item.center &&
                        styles.feedTabIcon,
                      activeRecruiterPage ===
                        item.page &&
                        !item.center &&
                        styles.recruiterTabIconActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        item.icon
                      }
                      size={
                        item.center
                          ? 24
                          : 21
                      }
                      color={
                        item.center
                          ? '#FFF8F5'
                          : activeRecruiterPage ===
                              item.page
                            ? '#FF4F70'
                            : '#697386'
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.tabLabel,
                      item.center &&
                        styles.feedTabLabel,
                      activeRecruiterPage ===
                        item.page &&
                        !item.center &&
                        styles.activeTab,
                    ]}
                  >
                    {
                      item.label
                    }
                  </Text>
                </Pressable>
              )
            )}
          </View>
        ) : (
          <View
            style={[
              styles.tabBar,
              {
                height:
                  65 +
                  insets.bottom,
                paddingBottom:
                  Math.max(
                    insets.bottom,
                    4
                  ),
              },
            ]}
          >
            {tabs.map(
              ([
                name,
                icon,
              ]) => (
                <Pressable
                  key={name}
                  onPress={() =>
                    setPage(
                      name
                    )
                  }
                  style={
                    styles.tab
                  }
                >
                  <Ionicons
                    name={
                      icon
                    }
                    size={
                      21
                    }
                    color={
                      page ===
                        name ||
                      (page ===
                        'Job Seeker' &&
                        name ===
                          'Home')
                        ? '#FF4F70'
                        : '#697386'
                    }
                  />

                  <Text
                    style={[
                      styles.tabLabel,
                      (page ===
                        name ||
                        (page ===
                          'Job Seeker' &&
                          name ===
                            'Home')) &&
                        styles.activeTab,
                    ]}
                  >
                    {
                      name
                    }
                  </Text>
                </Pressable>
              )
            )}
          </View>
        ))}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F3F7',
  },

  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  authWrap: {
    flex: 1,
    justifyContent: 'center',
  },

  authCard: {
    backgroundColor: '#FFF8F5',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#F2F3F7',
    elevation: 2,
  },

  authSubtitle: {
    textAlign: 'center',
    color: '#17243B',
    fontWeight: '700',
    lineHeight: 21,
    marginTop: -2,
    marginBottom: 22,
  },

  authModeRow: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#F2F3F7',
    padding: 4,
    marginBottom: 20,
  },

  authMode: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },

  authModeActive: {
    backgroundColor: '#FFF8F5',
    elevation: 1,
  },

  authModeText: {
    color: '#697386',
    fontWeight: '700',
  },

  authModeTextActive: {
    color: BLUE,
  },

  authTitle: {
    color: '#17243B',
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 4,
  },

  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  roleChoice: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#697386',
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: '#FFF8F5',
  },

  roleChoiceActive: {
    borderColor: BLUE,
    backgroundColor: '#FFDFE6',
  },

  roleChoiceText: {
    color: '#697386',
    fontWeight: '700',
  },

  roleChoiceTextActive: {
    color: BLUE,
  },

  authFootnote: {
    color: '#697386',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 17,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 4,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#F2F3F7',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 6,
  },

  statValue: {
    color: BLUE,
    fontWeight: '900',
    fontSize: 22,
  },

  statLabel: {
    color: '#697386',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  recruiterJob: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F7',
    paddingVertical: 12,
  },

  activeBadge: {
    color: '#159B72',
    backgroundColor: '#FFF8F5',
    overflow: 'hidden',
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 5,
  },

  applicant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F7',
  },

  applicantName: {
    color: '#17243B',
    fontWeight: '800',
    marginBottom: 3,
  },

  smallAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFDFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    height: 54,
    backgroundColor: '#FFF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },

  brand: {
    fontSize: 21,
    fontWeight: '900',
    color: '#17243B',
  },

  content: {
    padding: 16,
    paddingBottom: 104,
  },

  pageTitle: {
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '900',
    color: '#17243B',
    marginBottom: 5,
  },

  hero: {
    backgroundColor: '#FFDFE6',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },

  eyebrow: {
    color: BLUE,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '800',
    marginBottom: 10,
  },

  heroTitle: {
    color: '#17243B',
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '900',
    marginBottom: 8,
  },

  muted: {
    color: '#697386',
    fontSize: 14,
    lineHeight: 21,
  },

  body: {
    color: '#697386',
    fontSize: 14,
    lineHeight: 21,
  },

  card: {
    backgroundColor: '#FFF8F5',
    borderRadius: 18,
    padding: 17,
    marginTop: 13,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F2F3F7',
    shadowColor: '#17243B',
    shadowOpacity: 0.035,
    shadowRadius: 7,
    elevation: 1,
  },

  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    color: '#17243B',
    fontWeight: '800',
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  jobTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    color: '#17243B',
    marginBottom: 5,
  },

  salary: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 9,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginVertical: 10,
  },

  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFDFE6',
    backgroundColor: '#FFDFE6',
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginRight: 4,
  },

  chipSelected: {
    borderColor: BLUE,
    backgroundColor: BLUE,
  },

  chipText: {
    color: '#FF4F70',
    fontSize: 12,
    fontWeight: '700',
  },

  chipTextSelected: {
    color: '#FFF8F5',
  },

  match: {
    color: '#159B72',
    backgroundColor: '#FFF8F5',
    overflow: 'hidden',
    borderRadius: 18,
    padding: 7,
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },

  smallMuted: {
    color: '#697386',
    fontSize: 12,
    lineHeight: 17,
  },

  apply: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFDFE6',
  },

  applyText: {
    color: BLUE,
    fontWeight: '800',
  },

  button: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    backgroundColor: BLUE,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFF8F5',
    fontWeight: '800',
    fontSize: 15,
  },

  secondaryButton: {
    backgroundColor: '#FFDFE6',
  },

  secondaryButtonText: {
    color: BLUE,
  },

  progress: {
    height: 9,
    backgroundColor: '#FFDFE6',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },

  progressFill: {
    width: '75%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: BLUE,
  },

  link: {
    color: BLUE,
    fontWeight: '800',
  },

  searchInput: {
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#697386',
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    color: '#17243B',
    marginTop: 17,
  },

  filterRow: {
    flexGrow: 0,
    marginVertical: 10,
  },

  empty: {
    textAlign: 'center',
    color: '#697386',
    marginTop: 30,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    marginVertical: 12,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  profileHero: {
    backgroundColor: '#FFF8F5',
    padding: 22,
    alignItems: 'center',
    borderRadius: 22,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F2F3F7',
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFDFE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: {
    color: BLUE,
    fontSize: 28,
    fontWeight: '900',
  },

  progressLabel: {
    marginTop: 18,
    color: BLUE,
    fontWeight: '800',
  },

  label: {
    color: '#17243B',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#697386',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#17243B',
    backgroundColor: '#FFF8F5',
  },

  inputDisabled: {
    color: '#697386',
    backgroundColor: '#F2F3F7',
  },

  inputError: {
    borderColor: BLUE,
    borderWidth: 1.5,
  },

  errorText: {
    color: BLUE,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 5,
  },

  tabBar: {
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#F2F3F7',
    backgroundColor: '#FFF8F5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  tabLabel: {
    fontSize: 10,
    color: '#697386',
    marginTop: 2,
    fontWeight: '600',
  },

  activeTab: {
    color: BLUE,
    fontWeight: '900',
  },

  toast: {
    position: 'absolute',
    bottom: 77,
    alignSelf: 'center',
    backgroundColor: '#159B72',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  toastText: {
    color: '#FFF8F5',
    fontWeight: '700',
  },

  feedPage: {
    flex: 1,
    minHeight: 0,
  },

  feedWrap: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },

  feedIntro: {
    marginBottom: 8,
  },

  feedIntroHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  feedTitle: {
    color: '#17243B',
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    marginBottom: 3,
  },

  feedCount: {
    color: '#7057E8',
    fontWeight: '800',
    fontSize: 12,
    marginTop: 10,
  },

  deckArea: {
    flex: 1,
    minHeight: 250,
    marginTop: 7,
    marginBottom: 8,
    position: 'relative',
  },

  candidateScroll: {
    flex: 1,
  },

  candidateCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#FFF8F5',
    borderColor: '#F2F3F7',
    borderWidth: 1,
    borderRadius: 24,
    elevation: 5,
    shadowColor: '#17243B',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  candidateCardBack: {
    top: 8,
    left: 8,
    right: 8,
    bottom: -8,
    backgroundColor: '#FFDFE6',
    elevation: 2,
  },

  cardBackBlock: {
    height: 140,
    backgroundColor: '#FF4F70',
    opacity: 0.15,
  },

  candidateContent: {
    paddingBottom: 20,
  },

  candidateHero: {
    alignItems: 'center',
    backgroundColor: '#FFDFE6',
    padding: 20,
    paddingTop: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  candidateAvatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#7057E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  candidateInitials: {
    color: '#FFF8F5',
    fontSize: 25,
    fontWeight: '900',
  },

  candidateName: {
    color: '#17243B',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
  },

  candidateHeadline: {
    color: '#FF4F70',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 3,
    textAlign: 'center',
  },

  candidateMeta: {
    color: '#697386',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  candidateDetails: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  candidateSectionTitle: {
    color: '#17243B',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 4,
  },

  candidateCopy: {
    color: '#697386',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 5,
  },

  candidateSkill: {
    backgroundColor: '#F2F3F7',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },

  candidateSkillText: {
    color: '#17243B',
    fontSize: 11,
    fontWeight: '700',
  },

  swipeStamp: {
    position: 'absolute',
    top: 35,
    zIndex: 5,
    borderWidth: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  likeStamp: {
    left: 20,
    borderColor: '#159B72',
    transform: [
      {
        rotate: '-14deg',
      },
    ],
  },

  passStamp: {
    right: 20,
    borderColor: '#FF4F70',
    transform: [
      {
        rotate: '14deg',
      },
    ],
  },

  swipeStampText: {
    fontSize: 24,
    fontWeight: '900',
  },

  likeStampText: {
    color: '#159B72',
  },

  passStampText: {
    color: '#FF4F70',
  },

  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 4,
    flexShrink: 0,
  },

  swipeAction: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  passAction: {
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#FFDFE6',
  },

  likeAction: {
    backgroundColor: '#159B72',
  },

  swipeHint: {
    color: '#697386',
    fontSize: 11,
    fontWeight: '700',
  },

  swipeFootnote: {
    textAlign: 'center',
    color: '#697386',
    fontSize: 11,
    marginTop: 5,
    flexShrink: 0,
  },

  feedEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 420,
    padding: 24,
    backgroundColor: '#FFF8F5',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F2F3F7',
    marginTop: 14,
  },

  feedEmptyTitle: {
    color: '#17243B',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 7,
  },

  smallPrimaryButton: {
    minWidth: 74,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  smallPrimaryButtonText: {
    color: '#FFF8F5',
    fontWeight: '800',
    fontSize: 12,
  },

  dangerLink: {
    color: '#C83A57',
    fontWeight: '800',
  },

  inactiveBadge: {
    color: '#697386',
    backgroundColor: '#F2F3F7',
    overflow: 'hidden',
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 5,
  },

  recruiterTabIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },

  recruiterTabIconActive: {
    backgroundColor: '#FFDFE6',
  },

  feedTabIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF4F70',
    marginTop: -23,
    borderWidth: 4,
    borderColor: '#FFF8F5',
    elevation: 5,
  },

  feedTabLabel: {
    color: '#FF4F70',
    fontWeight: '900',
  },
});